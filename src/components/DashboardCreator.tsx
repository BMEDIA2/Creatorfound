import React from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Users, CheckCircle, X, Briefcase, MessageSquare, TrendingUp, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Project, Proposal, User } from '../types';

interface DashboardCreatorProps {
  currentUser: User;
  projects: Project[];
  proposals: Proposal[];
  setActiveModal: (modal: string | null) => void;
  closeProject: (projectId: string) => void;
  markProjectCompleted: (projectId: string) => void;
  updateProposalStatus: (propId: string, status: 'accepted' | 'rejected') => void;
  startConversation: (userId: string, userName: string) => void;
  onNewProject: () => void;
}

export default function DashboardCreator({
  currentUser,
  projects,
  proposals,
  setActiveModal,
  closeProject,
  markProjectCompleted,
  updateProposalStatus,
  startConversation,
  onNewProject
}: DashboardCreatorProps) {
  const myProjects = projects.filter(p => p.creatorId === currentUser.id);
  const activeProjects = myProjects.filter(p => p.status === 'active');
  const completedProjects = myProjects.filter(p => p.status === 'completed');
  const totalProposals = myProjects.reduce((acc, proj) => {
    return acc + proposals.filter(p => p.projectId === proj.id).length;
  }, 0);

  const stats = [
    { label: 'Proyectos Totales', value: myProjects.length, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Activos', value: activeProjects.length, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Completados', value: completedProjects.length, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Propuestas Recibidas', value: totalProposals, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Creador</span>
          </h1>
          <p className="text-gray-400 text-lg">Gestiona tus proyectos y encuentra el talento perfecto.</p>
        </div>
        <button
          onClick={onNewProject}
          className="group px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" />
          </div>
          <span>Publicar Nuevo Proyecto</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Projects List */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Mis Proyectos
          </h2>

          <div className="space-y-6">
            {myProjects.length > 0 ? (
              myProjects.map(p => {
                const projectProposals = proposals.filter(prop => prop.projectId === p.id);
                return (
                  <div key={p.id} className="bg-[#111111] rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
                    {/* Project Header */}
                    <div className="p-6 border-b border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white mb-1">{p.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {p.budget}</span>
                            {p.projectDuration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {p.projectDuration === 'short' ? 'Corto' : p.projectDuration === 'medium' ? 'Medio' : 'Largo'}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border border-white/5
                          ${p.status === 'active' ? 'bg-green-500/10 text-green-400' :
                            p.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                              p.status === 'completed' ? 'bg-purple-500/10 text-purple-400' :
                                'bg-gray-500/10 text-gray-400'}`}>
                          {p.status === 'active' ? 'ACTIVO' :
                            p.status === 'in-progress' ? 'EN PROGRESO' :
                              p.status === 'completed' ? 'COMPLETADO' : 'CERRADO'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        {p.status === 'active' && (
                          <button onClick={() => closeProject(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                            Cerrar Proyecto
                          </button>
                        )}
                        {p.status === 'in-progress' && (
                          <button onClick={() => markProjectCompleted(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition">
                            Marcar Completado
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Proposals Section */}
                    <div className="p-6 bg-black/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm text-gray-300 flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-400" />
                          Propuestas ({projectProposals.length})
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {projectProposals.length > 0 ? projectProposals.map(prop => (
                          <div key={prop.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                                  {prop.freelancerName[0]}
                                </div>
                                <div>
                                  <span className="font-bold text-white block">{prop.freelancerName}</span>
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {prop.time}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded-lg">
                                {prop.price}
                              </span>
                            </div>

                            <p className="text-sm text-gray-400 mb-4 line-clamp-2 pl-13 border-l-2 border-white/10 pl-3 ml-2">
                              {prop.coverLetter}
                            </p>

                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                              <a href={prop.portfolio} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                Ver Portafolio <ArrowRight className="w-3 h-3" />
                              </a>

                              {prop.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => updateProposalStatus(prop.id, 'rejected')} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition">
                                    Rechazar
                                  </button>
                                  <button onClick={() => startConversation(prop.freelancerId, prop.freelancerName)} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs font-semibold hover:bg-white/10 transition">
                                    Mensaje
                                  </button>
                                  <button onClick={() => updateProposalStatus(prop.id, 'accepted')} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition">
                                    Aceptar
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${prop.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {prop.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-6 text-gray-500 text-sm italic bg-white/5 rounded-xl border border-white/5 border-dashed">
                            Aún no has recibido propuestas para este proyecto.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No tienes proyectos activos</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Publica tu primer proyecto para empezar a recibir propuestas de los mejores talentos.</p>
                <button onClick={onNewProject} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20">
                  Crear Proyecto Ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-900/20 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-[#1a1a1a] border-4 border-[#111111] shadow-xl mb-4 overflow-hidden flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{currentUser.name[0]}</span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white">{currentUser.channel || currentUser.name}</h3>
              <p className="text-purple-400 font-medium mb-6">Creador de Contenido</p>

              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Proyectos</span>
                  <span className="text-sm font-bold text-white">{myProjects.length}</span>
                </div>
                {currentUser.reputation && (
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-400">Reputación</span>
                    <span className="text-sm font-bold text-green-400">{currentUser.reputation.score}/100</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Gasto Total</span>
                  <span className="text-sm font-bold text-white">$0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-3xl p-6">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Tip para Creadores
            </h4>
            <p className="text-sm text-purple-200/80 leading-relaxed">
              Los proyectos con descripciones detalladas y ejemplos visuales reciben propuestas de mayor calidad.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
