import React from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, FileText, Clock, CheckCircle, XCircle, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Project, Proposal, User } from '../types';

interface DashboardFreelancerProps {
  currentUser: User;
  proposals: Proposal[];
  projects: Project[];
  setActiveSection: (section: string) => void;
}

export default function DashboardFreelancer({
  currentUser,
  proposals,
  projects,
  setActiveSection
}: DashboardFreelancerProps) {
  const myProposals = proposals.filter(p => p.freelancerId === currentUser.id);
  const pendingProposals = myProposals.filter(p => p.status === 'pending');
  const acceptedProposals = myProposals.filter(p => p.status === 'accepted');
  const rejectedProposals = myProposals.filter(p => p.status === 'rejected');

  const stats = [
    { label: 'Propuestas Totales', value: myProposals.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Pendientes', value: pendingProposals.length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Aceptadas', value: acceptedProposals.length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Rechazadas', value: rejectedProposals.length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
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
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{currentUser.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">Bienvenido a tu panel de control profesional.</p>
        </div>
        <button 
          onClick={() => setActiveSection('explore')} 
          className="group px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
        >
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="font-semibold text-white">Buscar Nuevos Proyectos</span>
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
        {/* Main Content - Proposals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Actividad Reciente
            </h2>
          </div>

          <div className="space-y-4">
            {myProposals.length > 0 ? (
              myProposals.map(prop => {
                const project = projects.find(proj => proj.id === prop.projectId) || { title: 'Proyecto no disponible', budget: 'N/A' } as Project;
                const statusConfig = {
                  'pending': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pendiente' },
                  'accepted': { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Aceptada' },
                  'rejected': { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Rechazada' }
                };
                const config = statusConfig[prop.status];

                return (
                  <div key={prop.id} className="group bg-[#111111] hover:bg-[#161616] border border-white/5 hover:border-indigo-500/30 p-5 rounded-2xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(prop.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Oferta: {prop.price}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border border-white/5`}>
                        {config.label}
                      </span>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-3 text-sm text-gray-400 italic border border-white/5">
                      "{prop.coverLetter.substring(0, 120)}..."
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No tienes propuestas activas</h3>
                <p className="text-gray-400 mb-6">Explora los proyectos disponibles y envía tu primera propuesta hoy.</p>
                <button onClick={() => setActiveSection('explore')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                  Explorar Proyectos
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-[#1a1a1a] border-4 border-[#111111] shadow-xl mb-4 overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                    {currentUser.name[0]}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white">{currentUser.name} {currentUser.lastname}</h3>
              <p className="text-indigo-400 font-medium mb-6">{currentUser.specialty || 'Freelancer'}</p>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Nivel</span>
                  <span className="text-sm font-bold text-white">{currentUser.reputation?.level || 'Nuevo'}</span>
                </div>
                {currentUser.reputation && (
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-400">Reputación</span>
                    <span className="text-sm font-bold text-green-400">{currentUser.reputation.score}/100</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Miembro desde</span>
                  <span className="text-sm font-bold text-white">2024</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition border border-white/10">
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-6">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Tip Pro
            </h4>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              Los perfiles con portafolio completo reciben 3x más respuestas. Asegúrate de añadir tus mejores trabajos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
