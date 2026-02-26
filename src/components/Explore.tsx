import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, ArrowRight, DollarSign, Clock, CheckCircle, Mail, Twitter, Linkedin, Plus, Bookmark } from 'lucide-react';
import { Project, User } from '../types';

interface ExploreProps {
  currentUser: User | null;
  projects: Project[];
  setActiveModal: (modal: string | null) => void;
  setViewingProject: (project: Project | null) => void;
  viewingProject: Project | null;
  setSelectedProjectForProposal: (project: {id: string, title: string} | null) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function Explore({ 
  currentUser, 
  projects, 
  setActiveModal, 
  setViewingProject, 
  viewingProject,
  setSelectedProjectForProposal,
  showToast
}: ExploreProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [minBudgetFilter, setMinBudgetFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesBudget = true;
    if (minBudgetFilter) {
      const budgetNums = p.budget.match(/\d+/g);
      if (budgetNums) {
        const maxBudgetInProject = Math.max(...budgetNums.map(Number));
        matchesBudget = maxBudgetInProject >= Number(minBudgetFilter);
      }
    }

    const matchesExp = experienceFilter === 'all' || p.experience === experienceFilter;

    return matchesCat && matchesSearch && matchesBudget && matchesExp;
  });

  if (viewingProject) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setViewingProject(null)}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </div>
            <span className="font-medium">Volver a los anuncios</span>
          </button>

          <div className="bg-[#111111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Header Section */}
            <div className="relative p-8 md:p-12 border-b border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                    {viewingProject.creatorName.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        {viewingProject.category}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Hace 2 horas
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{viewingProject.title}</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="font-medium text-white">{viewingProject.creatorName}</span>
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="w-1 h-1 rounded-full bg-gray-600 mx-2"></span>
                      <span>Empresa Verificada</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={() => {
                      if (!currentUser) {
                        showToast('Inicia sesión para aplicar', 'error');
                        setActiveModal('login');
                      } else if (currentUser.type === 'creator') {
                        showToast('Los creadores no pueden aplicar', 'error');
                      } else {
                        setSelectedProjectForProposal({id: viewingProject.id, title: viewingProject.title});
                        setActiveModal('proposal');
                      }
                    }}
                    className="w-full md:w-auto btn-primary px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Aplicar Ahora <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2">
                    <Bookmark className="w-5 h-5" /> Guardar
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <DollarSign className="w-4 h-4" /> Presupuesto
                  </div>
                  <div className="font-bold text-white text-lg">{viewingProject.budget}</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <Briefcase className="w-4 h-4" /> Experiencia
                  </div>
                  <div className="font-bold text-white text-lg capitalize">{viewingProject.experience}</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <Clock className="w-4 h-4" /> Duración
                  </div>
                  <div className="font-bold text-white text-lg capitalize">{viewingProject.duration}</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <MapPin className="w-4 h-4" /> Ubicación
                  </div>
                  <div className="font-bold text-white text-lg">Remoto</div>
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-8 md:p-12">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold text-white mb-6">Descripción del Proyecto</h3>
                <div className="text-gray-300 leading-relaxed space-y-6 text-lg">
                  <p>{viewingProject.description}</p>
                  <p>
                    Buscamos a un profesional talentoso que pueda dar vida a ideas creativas. 
                    Trabajarás en estrecha colaboración con nuestro equipo de contenido para asegurar 
                    resultados de alta calidad que resuenen con nuestra audiencia.
                  </p>
                  <h4 className="text-xl font-bold text-white mt-8 mb-4">Responsabilidades:</h4>
                  <ul className="list-disc list-inside space-y-3 text-gray-400 ml-4 marker:text-indigo-500">
                    <li>Colaborar con el equipo creativo para definir los requisitos del proyecto.</li>
                    <li>Ejecutar proyectos desde el concepto hasta la finalización con atención al detalle.</li>
                    <li>Adaptarse a los comentarios e iterar rápidamente para cumplir con los plazos.</li>
                    <li>Mantener la consistencia de la marca en todos los entregables.</li>
                  </ul>
                </div>
              </div>

              {/* Tags Section at the bottom */}
              <div className="mt-16 pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Habilidades Requeridas</h3>
                <div className="flex flex-wrap gap-3">
                  {viewingProject.skills.split(',').map((s, i) => (
                    <span key={i} className="px-5 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-gray-300 text-sm font-medium hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all cursor-default">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-12 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Compartir:</span>
                <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"><Mail className="w-4 h-4" /></button>
                <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"><Twitter className="w-4 h-4" /></button>
                <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"><Linkedin className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Explorar</h2>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition flex items-center gap-2 text-sm font-medium"
            >
              <Filter className="w-4 h-4" /> Filtros
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar proyectos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Categoría</h3>
              <div className="space-y-2">
                {['all', 'editing', 'thumbnail', 'script'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${categoryFilter === cat ? 'bg-indigo-600 border-indigo-600' : 'border-white/20 group-hover:border-white/40'}`}>
                      {categoryFilter === cat && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${categoryFilter === cat ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {cat === 'all' ? 'Todas' : cat === 'editing' ? 'Edición de Video' : cat === 'thumbnail' ? 'Miniaturas' : 'Guiones'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Experiencia</h3>
              <div className="space-y-2">
                {['all', 'junior', 'mid', 'senior', 'expert'].map(exp => (
                  <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${experienceFilter === exp ? 'bg-indigo-600 border-indigo-600' : 'border-white/20 group-hover:border-white/40'}`}>
                      {experienceFilter === exp && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm capitalize ${experienceFilter === exp ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {exp === 'all' ? 'Cualquiera' : exp}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Presupuesto Mínimo</h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="number" 
                  value={minBudgetFilter}
                  onChange={(e) => setMinBudgetFilter(e.target.value)}
                  placeholder="Ej: 100" 
                  className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full lg:hidden btn-primary py-3 rounded-xl font-bold text-white mt-4"
            >
              Guardar Filtros
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Tabs & Actions Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('all')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'all' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Todos los Proyectos
              </button>
              <button 
                onClick={() => setActiveTab('recommended')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'recommended' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Recomendados
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Guardados
              </button>
            </div>
            
            {currentUser?.type === 'creator' && (
              <button 
                onClick={() => setActiveModal('createProject')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                Publicar Proyecto
              </button>
            )}
          </div>

          {/* Job List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? filteredProjects.map(p => (
              <div 
                key={p.id} 
                onClick={() => setViewingProject(p)}
                className="bg-[#111111] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                    {p.creatorName.substring(0,2).toUpperCase()}
                  </div>
                  {p.status === 'active' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-400 uppercase tracking-wider">Nuevo</span>}
                </div>
                
                <div className="mb-4 flex-1">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {p.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="font-medium text-gray-300 truncate max-w-[100px]">{p.creatorName}</span>
                    <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Remoto</div>
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 2h</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.skills.split(',').slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs bg-white/5 px-2.5 py-1 rounded-md text-gray-300 border border-white/5">
                        {s.trim()}
                      </span>
                    ))}
                    {p.skills.split(',').length > 3 && (
                      <span className="text-xs bg-white/5 px-2.5 py-1 rounded-md text-gray-500 border border-white/5">
                        +{p.skills.split(',').length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <div className="font-bold text-white">{p.budget}</div>
                    <div className="text-xs text-gray-500 capitalize">{p.duration}</div>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-[#111111] rounded-2xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No se encontraron proyectos</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">No hay proyectos que coincidan con tus filtros actuales. Intenta ajustar tu búsqueda.</p>
                <button 
                  onClick={() => {
                    setSearchTerm(''); 
                    setCategoryFilter('all');
                    setExperienceFilter('all');
                    setMinBudgetFilter('');
                  }} 
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
