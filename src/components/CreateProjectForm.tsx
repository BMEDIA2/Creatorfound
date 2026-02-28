import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, X, Upload } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface CreateProjectFormProps {
    currentUser: User | null;
    onBack: () => void;
    showToast: (msg: string, type?: 'success' | 'error') => void;
    onProjectCreated: (project: any) => void;
}

export default function CreateProjectForm({
    currentUser,
    onBack,
    showToast,
    onProjectCreated
}: CreateProjectFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadingProgress, setUploadingProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        category: 'editing',
        budget: '',
        description: '',
        experienceTime: '',
        projectDuration: 'short',
        skills: '',
        exampleLinks: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files) as File[];
            if (images.length + newFiles.length > 5) {
                showToast('Puedes subir un máximo de 5 imágenes.', 'error');
                return;
            }

            const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
            setImages(prev => [...prev, ...validFiles]);

            // Create previews
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]); // Free memory
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const uploadImagesToSupabase = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        if (images.length === 0) return uploadedUrls;

        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `project_images/${fileName}`;

            setUploadingProgress(Math.round(((i) / images.length) * 100));

            const { data, error } = await supabase.storage
                .from('project_images')
                .upload(filePath, file);

            if (error) {
                console.error("Error uploading image:", error);
                throw new Error("No se pudo subir la imagen " + file.name);
            }

            if (data) {
                const { data: publicUrlData } = supabase.storage
                    .from('project_images')
                    .getPublicUrl(data.path);
                uploadedUrls.push(publicUrlData.publicUrl);
            }
        }

        setUploadingProgress(100);
        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            showToast('Debes iniciar sesión para publicar un proyecto', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload images first
            const imageUrls = await uploadImagesToSupabase();

            // Construct new project object matching the DB schema structure
            const newProject = {
                title: formData.title,
                category: formData.category,
                budget: formData.budget,
                description: formData.description,
                experience: formData.experienceTime || 'No requerida',
                duration: formData.projectDuration,
                skills: formData.skills,
                example_links: formData.exampleLinks, // Assuming snake_case column if using real DB, or map to camel if local
                creator_id: currentUser.id, // Replace with real DB relation
                creatorName: `${currentUser.name} ${currentUser.lastname}`,
                status: 'active',
                images: imageUrls, // Store the array of image URLs
                created_at: new Date().toISOString()
            };

            // Call the App.tsx handler (which will save to Supabase)
            onProjectCreated(newProject);

            showToast('¡Proyecto publicado con éxito!', 'success');
            onBack();
        } catch (error: any) {
            showToast(error.message || 'Error al publicar el proyecto', 'error');
        } finally {
            setIsSubmitting(false);
            setUploadingProgress(0);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-8 px-4"
        >
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition group"
            >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium">Volver</span>
            </button>

            <h1 className="text-3xl font-bold text-white mb-2">Publicar un Nuevo Proyecto</h1>
            <p className="text-gray-400 mb-8">Completa los detalles de tu vacante para encontrar al talento ideal.</p>

            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden bg-[#111111]">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Título del Proyecto *</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="Ej. Edición de video para YouTube estilo documental" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="input-field w-full px-4 py-3 rounded-xl text-white bg-[#1a1a1a] border border-white/10">
                                <option value="editing">Edición de Video</option>
                                <option value="thumbnail">Miniaturas</option>
                                <option value="script">Guiones</option>
                                <option value="other">Otros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Presupuesto *</label>
                            <input type="text" name="budget" required value={formData.budget} onChange={handleInputChange} placeholder="Ej: $100 - $300" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción detallada *</label>
                        <textarea name="description" required value={formData.description} onChange={handleInputChange} rows={5} placeholder="Describe el trabajo, el tipo de edición, la frecuencia..." className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Años de Experiencia (Opcional)</label>
                            <input type="text" name="experienceTime" value={formData.experienceTime} onChange={handleInputChange} placeholder="Ej: 2+ años" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Duración del Trabajo *</label>
                            <select name="projectDuration" value={formData.projectDuration} onChange={handleInputChange} className="input-field w-full px-4 py-3 rounded-xl text-white bg-[#1a1a1a] border border-white/10">
                                <option value="short">Corto Plazo (&lt; 1 mes)</option>
                                <option value="medium">Mediano Plazo (1-3 meses)</option>
                                <option value="long">Largo Plazo (&gt; 3 meses)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Habilidades Requeridas *</label>
                        <input type="text" name="skills" required value={formData.skills} onChange={handleInputChange} placeholder="Ej: Premiere Pro, After Effects, Color Grading (separados por coma)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Enlaces de Ejemplo (Opcional)</label>
                        <input type="text" name="exampleLinks" value={formData.exampleLinks} onChange={handleInputChange} placeholder="Enlaces a videos de referencia (separados por coma)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Imágenes de Referencia (Máx. 5)</label>
                        <p className="text-xs text-gray-500 mb-4">Sube capturas de pantalla, moodboards o ejemplos visuales para tu proyecto.</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 group">
                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-white/5 transition-colors">
                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Subir</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex justify-center items-center gap-2 ${isSubmitting ? 'bg-indigo-800 cursor-wait' : 'btn-primary shadow-indigo-500/20'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {uploadingProgress > 0 ? `Subiendo Imágenes (${uploadingProgress}%)...` : 'Publicando...'}
                                </>
                            ) : (
                                'Publicar Proyecto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
