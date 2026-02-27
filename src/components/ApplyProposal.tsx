import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, Briefcase, MapPin, CheckCircle, Bookmark, Mail, Twitter, Linkedin } from 'lucide-react';
import { Project, User } from '../types';

interface ApplyProposalProps {
    project: Project;
    currentUser: User | null;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
    showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function ApplyProposal({
    project,
    currentUser,
    onBack,
    onSubmit,
    showToast
}: ApplyProposalProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-8 px-4"
        >
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition group"
            >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium">Volver al anuncio</span>
            </button>

            <h1 className="text-3xl font-bold text-white mb-8">Enviar Propuesta</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form and Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Job Details Card */}
                    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/5">
                            <h2 className="text-xl font-bold text-white mb-4">Detalles del Trabajo</h2>
                            <h3 className="text-2xl font-bold text-indigo-400 mb-4">{project.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Publicado hace 2 horas</span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remoto</span>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-gray-300 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.skills.split(',').map((s, i) => (
                                    <span key={i} className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-white/5 text-gray-300 text-xs">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Proposal Form Card */}
                    <div className="glass-card rounded-3xl border border-white/10 p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Tu Propuesta</h2>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Carta de Presentación</label>
                                <textarea
                                    name="coverLetter"
                                    required
                                    rows={6}
                                    placeholder="¿Por qué eres el mejor candidato para este trabajo?"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Presupuesto Propuesto ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            name="price"
                                            required
                                            placeholder="Ej: 250"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tiempo Estimado</label>
                                    <select
                                        name="time"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                    >
                                        <option value="24h">Menos de 24 horas</option>
                                        <option value="3d">3 días</option>
                                        <option value="1w">1 semana</option>
                                        <option value="2w">2 semanas</option>
                                        <option value="1m">Más de un mes</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Enlace a Portafolio</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    required
                                    placeholder="https://tuportafolio.com"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full btn-primary py-4 rounded-2xl font-bold text-white text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1"
                                >
                                    Enviar Propuesta Ahora
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Sidebar info */}
                <div className="space-y-6">
                    <div className="glass-card rounded-3xl border border-white/10 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Sobre el Cliente</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg font-bold text-white">
                                {project.creatorName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-white">{project.creatorName}</p>
                                <div className="flex items-center gap-1 text-xs text-blue-400">
                                    <CheckCircle className="w-3 h-3" /> Verificado
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Proyectos publicados</span>
                                <span className="text-white font-medium">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tasa de contratación</span>
                                <span className="text-white font-medium">85%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total invertido</span>
                                <span className="text-white font-medium">$12K+</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-3xl border border-white/10 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Tu Seguridad</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Recuerda siempre mantener las comunicaciones y pagos dentro de la plataforma para estar protegido por nuestros términos de servicio.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
