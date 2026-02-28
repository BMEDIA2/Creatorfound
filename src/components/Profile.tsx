import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, PortfolioItem, Client, Review } from '../types';
import { Youtube, Instagram, Linkedin, Globe, Edit2, Save, X, Camera, Twitter, Video, Plus, Trash2, Star, CheckCircle, ExternalLink, Play, Trophy, Briefcase, MessageSquare, RefreshCw } from 'lucide-react';

interface ProfileProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
  isOwnProfile?: boolean;
  startConversation?: (userId: string, userName: string) => void;
  onBack?: () => void;
}

export default function Profile({ currentUser, onUpdateUser, isOwnProfile = true, startConversation, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(currentUser);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // --- Profile Completion Calculation ---
  const calculateCompletion = () => {
    let score = 0;
    if (formData.avatar) score += 10;
    if (formData.name && formData.lastname) score += 10;
    if (formData.description && formData.description.length > 50) score += 20;
    if (formData.skills && formData.skills.length > 0) score += 10;
    if (formData.portfolio && formData.portfolio.length > 0) score += 20;

    // Check connected socials for validation
    let socialBonus = 0;
    if (formData.socialLinks) {
      if (formData.socialLinks.youtube) socialBonus += 5;
      if (formData.socialLinks.tiktok) socialBonus += 5;
      if (formData.socialLinks.instagram) socialBonus += 5;
      if (formData.socialLinks.linkedin) socialBonus += 2;
      if (formData.socialLinks.website) socialBonus += 3;
    }
    score += Math.min(socialBonus, 15); // Max 15 points for social linking

    if (formData.clients && formData.clients.length > 0) score += 5;
    if (formData.categories && formData.categories.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const completionPercentage = calculateCompletion();

  const handleSave = () => {
    if (onUpdateUser) onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: Date.now().toString(),
      clientName: 'Usuario Anónimo', // In a real app, this would be the logged-in user's name
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };

    // In a real app, this would call an API to add the review to the user's profile
    // For now, we just update the local state to simulate it
    setFormData({ ...formData, reviews: [...(formData.reviews || []), review] });
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: '' });
    alert('¡Reseña enviada con éxito!');
  };

  const handleChange = (field: keyof User, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSocialChange = (network: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [network]: value
      }
    });
  };

  // --- Portfolio Helpers ---
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYoutubeThumbnail = (url: string) => {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: '',
      url: '',
      thumbnail: ''
    };
    setFormData({ ...formData, portfolio: [...(formData.portfolio || []), newItem] });
  };

  const updatePortfolioItem = (id: string, field: keyof PortfolioItem, value: string) => {
    let updatedItems = formData.portfolio || [];

    if (field === 'url') {
      // Auto-generate thumbnail if URL is YouTube and thumbnail is empty
      const thumbnail = getYoutubeThumbnail(value);
      updatedItems = updatedItems.map(p => p.id === id ? { ...p, [field]: value, thumbnail: p.thumbnail || thumbnail } : p);
    } else {
      updatedItems = updatedItems.map(p => p.id === id ? { ...p, [field]: value } : p);
    }

    setFormData({ ...formData, portfolio: updatedItems });
  };

  const removePortfolioItem = (id: string) => {
    setFormData({ ...formData, portfolio: formData.portfolio?.filter(p => p.id !== id) });
  };

  // --- Client Helpers ---
  const addClient = () => {
    const newClient: Client = { id: Date.now().toString(), name: 'Nuevo Cliente' };
    setFormData({ ...formData, clients: [...(formData.clients || []), newClient] });
  };

  const updateClient = (id: string, name: string) => {
    const updated = formData.clients?.map(c => c.id === id ? { ...c, name } : c);
    setFormData({ ...formData, clients: updated });
  };

  const removeClient = (id: string) => {
    setFormData({ ...formData, clients: formData.clients?.filter(c => c.id !== id) });
  };

  // --- Review Helpers ---
  const addReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      clientName: 'Nombre Cliente',
      rating: 5,
      comment: 'Excelente trabajo...',
      date: new Date().toLocaleDateString()
    };
    setFormData({ ...formData, reviews: [...(formData.reviews || []), newReview] });
  };

  const updateReview = (id: string, field: keyof Review, value: any) => {
    const updated = formData.reviews?.map(r => r.id === id ? { ...r, [field]: value } : r);
    setFormData({ ...formData, reviews: updated });
  };

  const removeReview = (id: string) => {
    setFormData({ ...formData, reviews: formData.reviews?.filter(r => r.id !== id) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Profile Completion Guide */}
      {formData.type !== 'admin' && (
        <div className="mb-8 bg-[#111111] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 relative z-10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CheckCircle className={`w-5 h-5 ${completionPercentage === 100 ? 'text-green-500' : 'text-indigo-500'}`} />
              Completitud del Perfil
            </h3>
            <span className="font-bold text-white">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 mb-4 relative z-10">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-400 relative z-10">
            {completionPercentage < 100
              ? 'Completa tu perfil para aumentar tu visibilidad y ganar la confianza de la comunidad.'
              : '¡Excelente! Tu perfil está completo y listo para destacar.'}
          </p>
        </div>
      )}

      <div className="bg-[#111111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-md transition flex items-center gap-2 pr-4 border border-white/10"
          >
            <X className="w-5 h-5" /> <span className="text-sm font-medium">Volver</span>
          </button>
        )}
        {/* Cover / Header Background */}
        <div className="h-48 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]"></div>
        </div>

        <div className="px-8 pb-8 relative -mt-20">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-[#1a1a1a] border-4 border-[#111111] overflow-hidden shadow-xl flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                {formData.avatar ? (
                  <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  formData.name.substring(0, 2).toUpperCase()
                )}
              </div>
              {isEditing && (
                <button
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer"
                  onClick={() => {
                    const url = prompt('Ingresa la URL de tu imagen de perfil:');
                    if (url) handleChange('avatar', url);
                  }}
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
            </div>

            {/* Name & Title */}
            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-xl w-full focus:border-indigo-500 outline-none"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => handleChange('lastname', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-xl w-full focus:border-indigo-500 outline-none"
                      placeholder="Apellido"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.specialty || ''}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-300 w-full focus:border-indigo-500 outline-none"
                    placeholder="Especialidad (ej. Editor de Video)"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{formData.name} {formData.lastname}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-indigo-400 font-medium text-lg">{formData.specialty || (formData.type === 'creator' ? 'Creador de Contenido' : 'Freelancer')}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${formData.type === 'creator'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                      {formData.type === 'creator' ? '🎬 Creador' : '💼 Freelancer'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition flex items-center gap-2">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition flex items-center gap-2 border border-white/10">
                      <Edit2 className="w-4 h-4" /> Editar Perfil
                    </button>
                    {formData.type !== 'admin' && (
                      <button
                        onClick={() => {
                          const newType = formData.type === 'creator' ? 'freelancer' : 'creator';
                          const updated = { ...formData, type: newType as 'creator' | 'freelancer' };
                          setFormData(updated);
                          if (onUpdateUser) onUpdateUser(updated);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-white font-medium transition flex items-center gap-2 border border-purple-500/30 hover:border-purple-500/60"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Cambiar a {formData.type === 'creator' ? 'Freelancer' : 'Creador'}
                      </button>
                    )}
                  </>
                )
              ) : (
                <button onClick={() => startConversation && startConversation(currentUser.id, currentUser.name)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  <MessageSquare className="w-4 h-4" /> Contactar
                </button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  Sobre Mí
                </h3>
                {isEditing ? (
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-indigo-500 outline-none resize-none"
                    placeholder="Cuéntanos sobre ti, tu experiencia y lo que te apasiona..."
                  />
                ) : (
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {formData.description || "No hay descripción disponible yet."}
                  </p>
                )}
              </section>

              {/* Portfolio Section */}
              {formData.type !== 'admin' && (
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Portafolio</h3>
                    {isEditing && (
                      <button onClick={addPortfolioItem} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Añadir Proyecto
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {formData.portfolio?.map((item) => (
                      <div key={item.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all">
                        {isEditing ? (
                          <div className="p-4 space-y-3">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updatePortfolioItem(item.id, 'title', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                              placeholder="Título del Proyecto"
                            />
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => updatePortfolioItem(item.id, 'url', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-gray-400 text-xs"
                              placeholder="URL del Video (YouTube/Vimeo)"
                            />
                            <input
                              type="text"
                              value={item.thumbnail || ''}
                              onChange={(e) => updatePortfolioItem(item.id, 'thumbnail', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-gray-400 text-xs"
                              placeholder="URL de Miniatura (Opcional)"
                            />
                            {item.url && (
                              <div className="aspect-video bg-black rounded overflow-hidden relative">
                                <img src={item.thumbnail || getYoutubeThumbnail(item.url) || 'https://via.placeholder.com/300'} alt="Preview" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="w-8 h-8 text-white fill-white opacity-80" />
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                              <button onClick={() => removePortfolioItem(item.id)} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                                <Trash2 className="w-3 h-3" /> Eliminar
                              </button>
                              <button onClick={handleSave} className="text-green-400 text-xs flex items-center gap-1 hover:text-green-300 font-medium">
                                <Save className="w-3 h-3" /> Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-black">
                            <img src={item.thumbnail || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white fill-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h4 className="text-white font-bold truncate">{item.title}</h4>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                    {!isEditing && (!formData.portfolio || formData.portfolio.length === 0) && (
                      <p className="text-gray-500 text-sm italic col-span-full">No hay proyectos en el portafolio.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Reviews Section */}
              {formData.type !== 'admin' && (
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Reseñas</h3>
                    {isOwnProfile ? (
                      isEditing && (
                        <button onClick={addReview} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Añadir Reseña
                        </button>
                      )
                    ) : (
                      <button onClick={() => setShowReviewModal(true)} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Dejar Reseña
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {formData.reviews?.map((review) => (
                      <div key={review.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={review.clientName}
                                onChange={(e) => updateReview(review.id, 'clientName', e.target.value)}
                                className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                placeholder="Nombre del Cliente"
                              />
                              <input
                                type="number"
                                min="1" max="5"
                                value={review.rating}
                                onChange={(e) => updateReview(review.id, 'rating', parseInt(e.target.value))}
                                className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                              />
                            </div>
                            <textarea
                              value={review.comment}
                              onChange={(e) => updateReview(review.id, 'comment', e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-gray-300 text-sm"
                              placeholder="Comentario"
                            />
                            <button onClick={() => removeReview(review.id)} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                              <Trash2 className="w-3 h-3" /> Eliminar
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-white">{review.clientName}</h4>
                                <div className="flex text-yellow-500 text-xs mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                          </>
                        )}
                      </div>
                    ))}
                    {!isEditing && (!formData.reviews || formData.reviews.length === 0) && (
                      <p className="text-gray-500 text-sm italic">No hay reseñas aún.</p>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Reputation Section */}
              {formData.type !== 'admin' && formData.reputation && (
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-24 h-24 text-yellow-500" />
                  </div>

                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 relative z-10">Reputación</h3>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">{formData.reputation.score}</p>
                        <p className="text-xs text-gray-400">Puntaje de Reputación</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${formData.reputation.level === 'Top Rated' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        formData.reputation.level === 'Expert' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          formData.reputation.level === 'Rising Talent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                        {formData.reputation.level}
                      </div>
                    </div>

                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${formData.reputation.score >= 90 ? 'bg-yellow-500' :
                          formData.reputation.score >= 70 ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}
                        style={{ width: `${formData.reputation.score}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span>{formData.reputation.completedJobs} trabajos completados</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Categories */}
              {formData.type !== 'admin' && (
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Habilidades y Categorías</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-2 text-sm">Categorías</h4>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.categories?.join(', ') || ''}
                          onChange={(e) => handleChange('categories', e.target.value.split(',').map(s => s.trim()))}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 text-sm focus:border-indigo-500 outline-none"
                          placeholder="Ej. Edición, Diseño, Guion"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.categories?.map((cat, i) => (
                            <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs font-medium">
                              {cat}
                            </span>
                          ))}
                          {(!formData.categories || formData.categories.length === 0) && <span className="text-gray-500 text-xs">Sin categorías</span>}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2 text-sm">Habilidades Técnicas</h4>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.skills?.join(', ') || ''}
                          onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 text-sm focus:border-indigo-500 outline-none"
                          placeholder="Ej. Premiere Pro, Photoshop"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills?.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs">
                              {skill}
                            </span>
                          ))}
                          {(!formData.skills || formData.skills.length === 0) && <span className="text-gray-500 text-xs">Sin habilidades</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Clients */}
              {formData.type !== 'admin' && (
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Clientes</h3>
                    {isEditing && (
                      <button onClick={addClient} className="text-xs text-indigo-400 hover:text-indigo-300">
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {formData.clients?.map((client) => (
                      <div key={client.id} className="flex items-center justify-between group">
                        {isEditing ? (
                          <div className="flex gap-2 w-full">
                            <input
                              type="text"
                              value={client.name}
                              onChange={(e) => updateClient(client.id, e.target.value)}
                              className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <button onClick={handleSave} className="text-green-400 hover:text-green-300">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={() => removeClient(client.id)} className="text-red-400 hover:text-red-300">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span>{client.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {!isEditing && (!formData.clients || formData.clients.length === 0) && (
                      <p className="text-gray-500 text-sm italic">No hay clientes listados.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Socials */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Redes Sociales (Para Validación de Perfil)</h3>

                <div className="space-y-4">
                  {/* YouTube / Google */}
                  <div className="group">
                    {isEditing ? (
                      <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Youtube className="w-5 h-5 text-red-500 shrink-0" />
                          <span className="text-sm text-white font-medium">YouTube</span>
                        </div>
                        {formData.socialLinks?.youtube ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 font-bold">Conectado</span>
                            <button
                              onClick={() => handleSocialChange('youtube', '')}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Desconectar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const { supabase } = await import('../lib/supabase');
                              await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: { redirectTo: window.location.origin }
                              });
                            }}
                            className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors font-bold"
                          >
                            Conectar
                          </button>
                        )}
                      </div>
                    ) : (
                      formData.socialLinks?.youtube && (
                        <a href={formData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/20">
                          <div className="p-2 bg-red-500/20 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                            <Youtube className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-300 group-hover:text-white">YouTube Vinculado</span>
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        </a>
                      )
                    )}
                  </div>

                  {/* TikTok */}
                  <div className="group">
                    {isEditing ? (
                      <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-pink-500 shrink-0" />
                          <span className="text-sm text-white font-medium">TikTok</span>
                        </div>
                        {formData.socialLinks?.tiktok ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 font-bold">Conectado</span>
                            <button
                              onClick={() => handleSocialChange('tiktok', '')}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Desconectar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => alert("La integración con TikTok OAuth estará disponible pronto.")}
                            className="text-xs bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 px-3 py-1.5 rounded-lg transition-colors font-bold"
                          >
                            Conectar (Próximamente)
                          </button>
                        )}
                      </div>
                    ) : (
                      formData.socialLinks?.tiktok && (
                        <a href={formData.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-pink-500/10 hover:text-pink-400 transition-all group border border-transparent hover:border-pink-500/20">
                          <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500 group-hover:scale-110 transition-transform">
                            <Video className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-300 group-hover:text-white">TikTok Vinculado</span>
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        </a>
                      )
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    {isEditing ? (
                      <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-purple-500 shrink-0" />
                          <span className="text-sm text-white font-medium">Instagram</span>
                        </div>
                        {formData.socialLinks?.instagram ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 font-bold">Conectado</span>
                            <button
                              onClick={() => handleSocialChange('instagram', '')}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Desconectar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => alert("La integración con Instagram OAuth estará disponible pronto.")}
                            className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-3 py-1.5 rounded-lg transition-colors font-bold"
                          >
                            Conectar (Próximamente)
                          </button>
                        )}
                      </div>
                    ) : (
                      formData.socialLinks?.instagram && (
                        <a href={formData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-purple-500/10 hover:text-purple-400 transition-all group border border-transparent hover:border-purple-500/20">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500 group-hover:scale-110 transition-transform">
                            <Instagram className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-300 group-hover:text-white">Instagram Vinculado</span>
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        </a>
                      )
                    )}
                  </div>

                  {/* LinkedIn / Website (Optional extras) */}
                  {isEditing && (
                    <>
                      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 focus-within:border-blue-500/50 transition-colors mt-6 pt-4 border-t border-white/10">
                        <Linkedin className="w-5 h-5 text-blue-500 shrink-0" />
                        <input
                          type="text"
                          value={formData.socialLinks?.linkedin || ''}
                          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          placeholder="Perfil de LinkedIn (Manual)"
                          className="bg-transparent border-none text-sm text-white w-full focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 focus-within:border-green-500/50 transition-colors">
                        <Globe className="w-5 h-5 text-green-500 shrink-0" />
                        <input
                          type="text"
                          value={formData.socialLinks?.website || ''}
                          onChange={(e) => handleSocialChange('website', e.target.value)}
                          placeholder="Sitio Web Personal (Manual)"
                          className="bg-transparent border-none text-sm text-white w-full focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                {!isEditing && !formData.socialLinks?.youtube && !formData.socialLinks?.tiktok && !formData.socialLinks?.instagram && (
                  <div className="text-center py-8 text-gray-500 text-sm border border-white/5 rounded-xl bg-white/5">
                    No hay redes sociales vinculadas para validar este perfil.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-6 text-white">Dejar una Reseña</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Comentario</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                  placeholder="Describe tu experiencia trabajando con este usuario..."
                ></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-white mt-6 bg-indigo-600 hover:bg-indigo-700 transition">Enviar Reseña</button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
