import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, ArrowRight, DollarSign, Clock, CheckCircle, Mail, Twitter, Linkedin, Plus, Bookmark } from 'lucide-react';
import { Project, User } from '../types';

import { supabase } from '../lib/supabase';

interface ExploreProps {
  currentUser: User | null;
  projects: Project[];
  setActiveModal: (modal: string | null) => void;
  setViewingProject: (project: Project | null) => void;
  viewingProject: Project | null;
  setSelectedProjectForProposal: (project: { id: string, title: string } | null) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onViewProfile: (user: User) => void;
  onApply: (project: Project) => void;
}

export default function Explore({
  currentUser,
  projects,
  setActiveModal,
  setViewingProject,
  viewingProject,
  setSelectedProjectForProposal,
  showToast,
  onApply
}: ExploreProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [minBudgetFilter, setMinBudgetFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      const fetchSaved = async () => {
        const { data } = await supabase
          .from('saved_projects')
          .select('*')
          .eq('user_id', currentUser.id);
        if (data) setSavedProjects(data);
      };
      fetchSaved();
    }
  }, [currentUser]);

  const toggleSaveProject = async (projectId: string) => {
    if (!currentUser) return;

    const isSaved = savedProjects.find(sp => sp.projectId === projectId || sp.project_id === projectId);

    if (isSaved) {
      await supabase.from('saved_projects').delete().eq('id', isSaved.id);
      setSavedProjects(prev => prev.filter(sp => sp.id !== isSaved.id));
      showToast('Proyecto eliminado de guardados', 'success');
    } else {
      const { data, error } = await supabase
        .from('saved_projects')
        .insert([{ user_id: currentUser.id, project_id: projectId }])
        .select()
        .single();

      if (!error && data) {
        setSavedProjects(prev => [...prev, data]);
        showToast('Proyecto guardado correctamente', 'success');
      }
    }
  };

  // External Jobs States
  const [externalLanguage, setExternalLanguage] = useState<'all' | 'es'>('all');
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState<string | null>(null);
  const [googleStartIndex, setGoogleStartIndex] = useState<number>(1);
  const [realJobs, setRealJobs] = useState<{
    id: string;
    platform: string;
    author: string;
    avatar: string;
    text: string;
    date: string;
    type: string;
    url: string;
    lang: string;
  }[]>([]);

  const fetchRealJobs = useCallback(async (startIndex = 1) => {
    setIsLoadingExternal(true);
    setExternalError(null);

    const baseQuery = externalLanguage === 'es'
      ? 'busco editor de video freelance OR diseñador de miniaturas'
      : 'hiring freelance video editor OR thumbnail designer';

    const env = (import.meta as any).env || {};

    // Lista de API Keys para alternar cuando una se agote (429 Too Many Requests)
    const apiKeys = [
      env.VITE_GOOGLE_SEARCH_API_KEY || 'AIzaSyAnq04JD8eLVjQb7hmyo_HL1WqjFjYNlMA',
      env.VITE_GOOGLE_SEARCH_API_KEY_2 || '', // Agrega tu segunda API Key aquí o en variables de entorno
      env.VITE_GOOGLE_SEARCH_API_KEY_3 || ''  // Agrega tu tercera API Key aquí o en variables de entorno
    ].filter(key => key && key.trim() !== '');

    const CX = env.VITE_GOOGLE_SEARCH_CX || '32f79b078dd764b90';

    let success = false;
    let fallbackError: any = null;

    for (let i = 0; i < apiKeys.length; i++) {
      const API_KEY = apiKeys[i];
      const url = `https://customsearch.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(baseQuery)}&start=${startIndex}`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 403) throw new Error('API Key sin permisos de Custom Search API (403 Forbidden).');
          if (res.status === 400) throw new Error('Petición inválida (400 Bad Request). Revisa la query.');
          if (res.status === 429) throw new Error('Límite de peticiones superado (429 Too Many Requests).');
          throw new Error(`Error de red HTTP: ${res.status}`);
        }

        const data = await res.json();
        const items = data.items || [];

        const newJobs = items.map((item: any) => {
          let hostname = 'Google Search';
          try { hostname = new URL(item.link).hostname.replace('www.', ''); } catch (e) { }

          return {
            id: item.cacheId || item.link || Math.random().toString(),
            platform: hostname,
            author: item.displayLink || hostname,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(hostname)}&background=random&color=fff&size=40`,
            text: `${item.title} - ${item.snippet}`,
            date: new Date().toISOString(),
            type: 'Oportunidad Externa',
            url: item.link,
            lang: externalLanguage,
          };
        });

        setGoogleStartIndex(startIndex + 10);
        setRealJobs(prev => {
          const existingUrls = new Set(prev.map(j => j.url));
          return [...prev, ...newJobs.filter((f: any) => !existingUrls.has(f.url))];
        });

        success = true;
        break; // Éxito con esta API Key, salir del ciclo

      } catch (err: any) {
        console.warn(`Error con la API KEY ${i + 1}:`, err.message);
        fallbackError = err;
        // Continuará con la siguiente API Key del ciclo `for`
      }
    }

    // Fallback: Si todas las API Keys fallan, intentamos usar DuckDuckGo HTML scraper vía allorigins
    if (!success) {
      console.warn('Usando scraper de DuckDuckGo como alternativa (todas las API Keys de Google fallaron).');
      try {
        const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(baseQuery + " site:linkedin.com/jobs OR site:upwork.com OR site:freelancer.com")}`;
        // allorigins is sometimes flaky, we'll try it but fail silently if it breaks
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(ddgUrl)}`;

        const ddgRes = await fetch(proxyUrl);
        if (!ddgRes.ok) throw new Error('No se pudo usar DuckDuckGo Proxy');

        const ddgData = await ddgRes.json();

        // Prevent crashing if contents are null
        if (!ddgData || !ddgData.contents) {
          throw new Error('Proxy returned empty contents');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(ddgData.contents, 'text/html');

        const results = Array.from(doc.querySelectorAll('.result'));
        const newJobs = results.map((result: any) => {
          const titleEl = result.querySelector('.result__title .result__a');
          const snippetEl = result.querySelector('.result__snippet');
          const linkEl = result.querySelector('.result__url');

          const title = titleEl ? titleEl.textContent?.trim() : 'Oportunidad sin título';
          const href = titleEl ? titleEl.getAttribute('href') : '';
          let actualLink = href;
          // Decode duckduckgo redirect if present
          if (href?.includes('uddg=')) {
            actualLink = decodeURIComponent(href.split('uddg=')[1].split('&')[0]);
          }

          const snippet = snippetEl ? snippetEl.textContent?.trim() : 'Sin descripción';
          let hostname = 'DuckDuckGo';
          try { hostname = new URL(actualLink).hostname.replace('www.', ''); } catch (e) { }

          return {
            id: actualLink || Math.random().toString(),
            platform: hostname,
            author: hostname,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(hostname)}&background=random&color=fff&size=40`,
            text: `${title} - ${snippet}`,
            date: new Date().toISOString(),
            type: 'Oportunidad Externa',
            url: actualLink,
            lang: externalLanguage,
          };
        }).filter((job: any) => job.url && !job.url.includes('duckduckgo.com'));

        setGoogleStartIndex(startIndex + 10);
        setRealJobs(prev => {
          const existingUrls = new Set(prev.map(j => j.url));
          return [...prev, ...newJobs.filter((f: any) => !existingUrls.has(f.url))];
        });

        success = true;
      } catch (ddgErr: any) {
        console.error('El scraper alternativa de DuckDuckGo falló también:', ddgErr);
        // Fallar silenciosamente en la UI para no arruinar la experiencia, solo mostrar vacío
        setExternalError('No pudimos cargar vacantes en este momento por límites de búsqueda. Intenta de nuevo más tarde.');
      }
    }

    setIsLoadingExternal(false);
  }, [externalLanguage]);

  useEffect(() => {
    if (activeTab === 'social' && realJobs.length === 0 && !isLoadingExternal && !externalError) {
      fetchRealJobs(1);
    }
  }, [activeTab, fetchRealJobs, realJobs.length, isLoadingExternal, externalError]);

  const handleLoadMoreExternal = () => {
    fetchRealJobs(googleStartIndex);
  };

  const displayedSocialPosts = realJobs.filter(post => {
    const matchesLang = externalLanguage === 'all' || post.lang === externalLanguage;
    return matchesLang;
  });

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

  // Derived arrays based on auth and tab
  let displayInternalProjects = activeTab === 'all' ? filteredProjects : projects;
  if (activeTab === 'saved') {
    displayInternalProjects = displayInternalProjects.filter(p => savedProjects.some(sp => sp.projectId === p.id || sp.project_id === p.id));
  }
  if (!currentUser) {
    displayInternalProjects = displayInternalProjects.slice(0, 3);
  }

  let finalExternalPosts = activeTab === 'social' ? displayedSocialPosts : realJobs;
  if (activeTab === 'saved') {
    finalExternalPosts = finalExternalPosts.filter(p => savedProjects.some(sp => sp.projectId === p.id || sp.project_id === p.id));
  }
  if (!currentUser && finalExternalPosts.length > 0) {
    finalExternalPosts = finalExternalPosts.slice(0, 3);
  }

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
                    {viewingProject.creatorName.substring(0, 2).toUpperCase()}
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
                        onApply(viewingProject);
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
                  <div className="font-bold text-white text-lg capitalize">{viewingProject.experienceTime || viewingProject.experience}</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <Clock className="w-4 h-4" /> Duración
                  </div>
                  <div className="font-bold text-white text-lg capitalize">
                    {viewingProject.projectDuration === 'short' ? 'Corto Plazo' :
                      viewingProject.projectDuration === 'medium' ? 'Mediano Plazo' :
                        viewingProject.projectDuration === 'long' ? 'Largo Plazo' : viewingProject.duration}
                  </div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                    <MapPin className="w-4 h-4" /> Ubicación
                  </div>
                  <div className="font-bold text-white text-lg">Remoto</div>
                </div>
              </div>

              {viewingProject.image && (
                <div className="mt-12 rounded-2xl overflow-hidden border border-white/10">
                  <img src={viewingProject.image} alt={viewingProject.title} className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}
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

                  {viewingProject.exampleLinks && viewingProject.exampleLinks.length > 0 && (
                    <>
                      <h4 className="text-xl font-bold text-white mt-8 mb-4">Ejemplos de Referencia:</h4>
                      <div className="flex flex-col gap-2">
                        {viewingProject.exampleLinks.map((link, idx) => (
                          <a key={idx} href={link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4 rotate-45" /> {link}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
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
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setCategoryFilter(cat)}
                  >
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
                  <label
                    key={exp}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setExperienceFilter(exp)}
                  >
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
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'all' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Todos los Proyectos
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'social' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Oportunidades Externas
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
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

          {activeTab === 'social' && (
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-green-400 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
                    Datos en tiempo real
                  </span>
                </div>

                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExternalLanguage('all')}
                    className={`text-xs font-bold uppercase tracking-wider transition ${externalLanguage === 'all' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setExternalLanguage('es')}
                    className={`text-xs font-bold uppercase tracking-wider transition ${externalLanguage === 'es' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Solo Español
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Encontrados: <span className="text-white font-bold">{displayedSocialPosts.length}</span> resultados
              </div>
            </div>
          )}

          {/* Job List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'all' ? (
              displayInternalProjects.length > 0 ? (
                <>
                  {displayInternalProjects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setViewingProject(p)}
                      className="bg-[#111111] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                          {p.creatorName.substring(0, 2).toUpperCase()}
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
                  ))}

                  {!currentUser && filteredProjects.length > 3 && (
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-500/20 flex flex-col items-center justify-center text-center h-full min-h-[250px] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      <h3 className="text-xl font-bold text-white mb-2 relative z-10">¿Quieres ver más?</h3>
                      <p className="text-indigo-300 text-sm mb-6 relative z-10">Únete para desbloquear {filteredProjects.length - 3} proyectos adicionales listos para tu propuesta.</p>
                      <button onClick={() => setActiveModal('register')} className="btn-primary py-3 px-6 rounded-xl font-bold text-white relative z-10 group-hover:scale-105 transition-transform">
                        Crear Cuenta Gratis
                      </button>
                    </div>
                  )}
                </>
              ) : (
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
              )
            ) : activeTab === 'social' ? (
              <>
                {finalExternalPosts.length > 0 ? (
                  <>
                    {finalExternalPosts.map(post => {
                      const isSaved = savedProjects.some(sp => sp.projectId === post.id);
                      return (
                        <div
                          key={post.id}
                          className="bg-[#111111] rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full relative"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentUser) {
                                toggleSaveProject(post.id);
                              } else {
                                // En la vida real, se usa un context de toast
                                alert('Inicia sesión para guardar');
                              }
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-10"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''}`} />
                          </button>
                          <div className="flex justify-between items-start mb-4 pr-10">
                            <div className="flex items-center gap-3">
                              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-white/10" />
                              <div>
                                <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{post.author}</h4>
                                <p className="text-[10px] text-blue-400 font-bold uppercase">{post.platform}</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 uppercase tracking-wider shrink-0">Reciente</span>
                          </div>

                          <p className="text-sm text-gray-300 mb-4 flex-1 line-clamp-4 italic">
                            "{post.text}"
                          </p>

                          <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                            <div>
                              <div className="font-bold text-white text-xs">{post.type}</div>
                              <div className="text-[10px] text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
                            </div>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition"
                            >
                              Ver Post
                            </a>
                          </div>
                        </div>
                      );
                    })}

                    {!currentUser && displayedSocialPosts.length > 3 && (
                      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-500/20 flex flex-col items-center justify-center text-center h-full min-h-[250px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">¿Buscas más oportunidades externas?</h3>
                        <p className="text-blue-300 text-sm mb-6 relative z-10">Inicia sesión y empieza a guardar tus favoritas y mantente actualizado en tiempo real.</p>
                        <button onClick={() => setActiveModal('login')} className="bg-blue-600 hover:bg-blue-500 py-3 px-6 rounded-xl font-bold text-white relative z-10 group-hover:scale-105 transition-transform">
                          Inicia Sesión Ahora
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-full text-center py-20 bg-[#111111] rounded-2xl border border-white/5">
                    {externalError ? (
                      <>
                        <h3 className="text-xl font-bold text-red-500 mb-2">Ops, hubo un problema</h3>
                        <p className="text-gray-400 max-w-md mx-auto">{externalError}</p>
                      </>
                    ) : (
                      <h3 className="text-xl font-bold text-white mb-2">No hay publicaciones recientes</h3>
                    )}
                  </div>
                )}

                <div className="col-span-full flex flex-col items-center justify-center mt-12 py-8 border-t border-white/5">
                  <div className="text-gray-500 text-sm mb-4 font-medium italic">
                    {isLoadingExternal ? 'Escaneando la web en busca de nuevas vacantes...' : '¿Buscas algo más específico?'}
                  </div>
                  <button
                    onClick={handleLoadMoreExternal}
                    disabled={isLoadingExternal}
                    className={`px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 ${isLoadingExternal ? 'opacity-70 cursor-wait' : 'hover:scale-105 active:scale-95'}`}
                  >
                    {isLoadingExternal ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Buscando más oportunidades...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Cargar más resultados
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                    Actualizado en tiempo real • 2026
                  </p>
                </div>
              </>
            ) : activeTab === 'saved' ? (
              !currentUser ? (
                <div className="col-span-full text-center py-20 bg-[#111111] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                  <Bookmark className="w-16 h-16 text-indigo-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Protege tus Oportunidades</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">Inicia sesión para guardar proyectos y vacantes externas, y accede a ellos en cualquier momento desde esta pestaña rápida.</p>
                  <button onClick={() => setActiveModal('login')} className="btn-primary py-3 px-8 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    Iniciar Sesión
                  </button>
                </div>
              ) : (
                displayInternalProjects.length === 0 && finalExternalPosts.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-[#111111] rounded-2xl border border-white/5">
                    <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aún no tienes ningún proyecto o vacante guardada.</p>
                  </div>
                ) : (
                  <>
                    {/* Render Internal Saved */}
                    {displayInternalProjects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setViewingProject(p)}
                        className="bg-[#111111] rounded-2xl p-6 border border-indigo-500/50 hover:border-indigo-400 transition-all group flex flex-col h-full cursor-pointer relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveProject(p.id);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-10"
                        >
                          <Bookmark className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center font-bold text-white shrink-0">
                            {p.creatorName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-md line-clamp-1">{p.title}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Interno</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                          <div>
                            <div className="font-bold text-indigo-400">{p.budget}</div>
                          </div>
                          <span className="text-xs bg-indigo-600/20 text-indigo-300 font-bold px-3 py-1 rounded-full group-hover:bg-indigo-600 transition">Ver Proyecto</span>
                        </div>
                      </div>
                    ))}

                    {/* Render External Saved */}
                    {finalExternalPosts.map(post => {
                      return (
                        <div
                          key={post.id}
                          className="bg-[#111111] rounded-2xl p-6 border border-blue-500/50 hover:border-blue-400 transition-all group flex flex-col h-full relative"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveProject(post.id);
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-10"
                          >
                            <Bookmark className="w-4 h-4 fill-blue-500 text-blue-500" />
                          </button>
                          <div className="flex justify-between items-start mb-4 pr-10">
                            <div className="flex items-center gap-3">
                              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-white/10" />
                              <div>
                                <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{post.author}</h4>
                                <p className="text-[10px] text-blue-400 font-bold uppercase">{post.platform} • Externa</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-300 mb-4 flex-1 line-clamp-4 italic">
                            "{post.text}"
                          </p>

                          <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                            <div>
                              <div className="text-[10px] text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
                            </div>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-blue-600/20 text-blue-300 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-lg font-bold transition"
                            >
                              Ver Post Enlace
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )
              )
            ) : (
              <div className="col-span-full text-center py-20 bg-[#111111] rounded-2xl border border-white/5">
                <p className="text-gray-400">No se encontraron resultados disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
