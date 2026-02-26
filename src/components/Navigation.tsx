import React from 'react';
import { Zap, Menu, X, Grid, Bell, Mail, Info } from 'lucide-react';
import { User, Announcement } from '../types';

interface NavigationProps {
  currentUser: User | null;
  activeSection: string;
  setActiveSection: (section: string) => void;
  setActiveModal: (modal: string | null) => void;
  handleLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  announcements: Announcement[];
}

export default function Navigation({
  currentUser,
  activeSection,
  setActiveSection,
  setActiveModal,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  announcements
}: NavigationProps) {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection(currentUser ? 'explore' : 'landing')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">CreatorMatch</span>
              </div>
              
              {currentUser && (
                <div className="hidden md:flex items-center gap-6">
                  <button 
                    onClick={() => setActiveSection('explore')} 
                    className={`text-sm font-medium transition ${activeSection === 'explore' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Jobs
                  </button>
                  <button 
                    onClick={() => setActiveSection('talent')} 
                    className={`text-sm font-medium transition ${activeSection === 'talent' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Talent
                  </button>
                  <button 
                    onClick={() => setActiveSection('blog')} 
                    className={`text-sm font-medium transition ${activeSection === 'blog' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Blog
                  </button>
                  <button 
                    onClick={() => setActiveSection('how-it-works')} 
                    className={`text-sm font-medium transition ${activeSection === 'how-it-works' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    How It Works
                  </button>
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {!currentUser ? (
                <>
                  <button onClick={() => setActiveSection('explore')} className="text-sm font-medium text-gray-300 hover:text-white transition">Explorar</button>
                  <button onClick={() => setActiveSection('blog')} className="text-sm font-medium text-gray-300 hover:text-white transition">Blog</button>
                  <button onClick={() => setActiveSection('how-it-works')} className="text-sm font-medium text-gray-300 hover:text-white transition">Cómo Funciona</button>
                  <div className="h-6 w-px bg-white/10 mx-2"></div>
                  <button onClick={() => setActiveModal('login')} className="text-sm font-medium text-gray-300 hover:text-white transition">Iniciar Sesión</button>
                  <button onClick={() => setActiveModal('register')} className="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white">
                    Empezar Ahora
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button className="p-2 text-gray-400 hover:text-white transition"><Grid className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-400 hover:text-white transition"><Bell className="w-5 h-5" /></button>
                  <button 
                    onClick={() => setActiveSection('inbox')}
                    className={`p-2 transition ${activeSection === 'inbox' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                  
                  <div className="h-6 w-px bg-white/10 mx-2"></div>
                  
                  <div className="relative group">
                    <button className="flex items-center gap-2 focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                        {currentUser.name[0]}
                      </div>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                      <button 
                        onClick={() => setActiveSection(currentUser.type === 'admin' ? 'dashboard-admin' : currentUser.type === 'creator' ? 'dashboard-creator' : 'dashboard-freelancer')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        {currentUser.type === 'admin' ? 'Panel de Administración' : 'Mi Panel'}
                      </button>
                      <button 
                        onClick={() => setActiveSection('profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Mi Perfil
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => { setActiveSection('explore'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Explorar</button>
              <button onClick={() => { setActiveSection('blog'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Blog</button>
              <button onClick={() => { setActiveSection('how-it-works'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Cómo Funciona</button>
              {currentUser ? (
                <>
                  <button onClick={() => { setActiveSection(currentUser.type === 'admin' ? 'dashboard-admin' : currentUser.type === 'creator' ? 'dashboard-creator' : 'dashboard-freelancer'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-indigo-400">
                    {currentUser.type === 'admin' ? 'Panel de Administración' : 'Mi Panel'}
                  </button>
                  <button onClick={() => { setActiveSection('inbox'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Mensajes</button>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setActiveModal('login'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-gray-300">Iniciar Sesión</button>
                  <button onClick={() => { setActiveModal('register'); setMobileMenuOpen(false); }} className="w-full btn-primary py-3 rounded-lg text-white font-semibold mt-4">Empezar Ahora</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Announcements Banner */}
      {announcements.filter(a => a.active).length > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          <span>{announcements.filter(a => a.active)[0].title}: {announcements.filter(a => a.active)[0].content}</span>
        </div>
      )}
    </>
  );
}
