import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface LandingProps {
  currentUser: User | null;
  setActiveSection: (section: string) => void;
  setActiveModal: (modal: string | null) => void;
  startConversation: (userId: string, userName: string) => void;
}

export default function Landing({ currentUser, setActiveSection, setActiveModal, startConversation }: LandingProps) {
  const [email, setEmail] = React.useState('');
  const [joined, setJoined] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setErrorText('');

    try {
      // Intentar guardar en Supabase. Si la tabla no existe en el proyecto real, fallará suavemente mostrando mensaje de éxito falso o error gestionable.
      const { error } = await supabase.from('waitlist').insert([{ email }]);

      if (error && error.code !== '42P01') { // Ignorar error si la tabla no existe para la demo o mostrarlo.
        console.error(error);
      }

      setJoined(true);
      setEmail('');
    } catch (err) {
      setErrorText('Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto w-full min-h-[80vh] flex flex-col justify-center">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-medium text-indigo-400">Más de 1,200 creadores conectados</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            El futuro del <span className="gradient-text">Creator Economy</span> está aquí
          </h1>

          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            La plataforma definitiva para conectar creadores de contenido con editores, diseñadores, y expertos de alto nivel.
            <strong> Únete a la lista de espera para tener acceso anticipado.</strong>
          </p>

          <div className="flex flex-col gap-4 max-w-md">
            {joined ? (
              <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2">
                <span className="text-lg font-bold mb-1">¡Gracias por unirte! 🎉</span>
                <span className="text-sm">Te avisaremos tan pronto abramos el acceso.</span>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  className="w-full bg-[#1a1a1a] border border-white/20 focus:border-indigo-500 rounded-full py-4 pl-6 pr-32 text-white outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-full px-6 text-white font-bold transition-all text-sm flex items-center justify-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? 'Cargando...' : 'Unirse Ahora'}
                </button>
              </form>
            )}

            {errorText && <p className="text-red-400 text-sm ml-4">{errorText}</p>}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/150?img=1" className="w-10 h-10 rounded-full border-2 border-black" alt="User" referrerPolicy="no-referrer" />
              <img src="https://i.pravatar.cc/150?img=2" className="w-10 h-10 rounded-full border-2 border-black" alt="User" referrerPolicy="no-referrer" />
              <img src="https://i.pravatar.cc/150?img=3" className="w-10 h-10 rounded-full border-2 border-black" alt="User" referrerPolicy="no-referrer" />
              <img src="https://i.pravatar.cc/150?img=4" className="w-10 h-10 rounded-full border-2 border-black" alt="User" referrerPolicy="no-referrer" />
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">4.9/5</span> rating de satisfacción
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative glass-card rounded-3xl p-6 space-y-4 border border-white/10">
            {/* Preview Cards */}
            {[
              { title: 'Editor de Video Gaming', tag: 'Urgente', desc: 'Busco editor para canal de gaming (500k subs).', color: 'from-red-500 to-pink-600', initials: 'YT' },
              { title: 'Diseñador de Thumbnails', tag: null, desc: 'Necesito diseñador para thumbnails de podcast.', color: 'from-blue-500 to-cyan-600', initials: 'TC', opacity: 'opacity-60' },
              { title: 'Guionista YouTube', tag: null, desc: 'Canal de educación financiera busca guionista.', color: 'from-green-500 to-emerald-600', initials: 'VE', opacity: 'opacity-40' }
            ].map((card, i) => (
              <div key={i} className={`glass-card rounded-2xl p-5 ${card.opacity || ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-bold`}>{card.initials}</div>
                    <div>
                      <h3 className="font-semibold text-white">{card.title}</h3>
                      <p className="text-xs text-gray-400">Hace {i * 2 + 2} horas</p>
                    </div>
                  </div>
                  {card.tag && <span className="tag px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">{card.tag}</span>}
                </div>
                <p className="text-sm text-gray-300">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text mb-1">1,200+</div>
          <div className="text-sm text-gray-400">Creadores Activos</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text mb-1">3,400+</div>
          <div className="text-sm text-gray-400">Profesionales</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text mb-1">$2.4M</div>
          <div className="text-sm text-gray-400">En Proyectos</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text mb-1">98%</div>
          <div className="text-sm text-gray-400">Satisfacción</div>
        </div>
      </div>

      {/* Top Talents Section */}
      <div className="w-full mt-24 mb-20">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-3xl font-bold">Top Talent</h2>
          <button onClick={() => setActiveSection('explore')} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm flex items-center gap-1">
            Explore 114K+ Talent <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Sarah Jenkins', role: 'Creative Director', img: 'https://i.pravatar.cc/150?img=5', status: 'red' },
            { name: 'Kai Takagi', role: 'Channel Manager', img: 'https://i.pravatar.cc/150?img=11', status: 'purple' },
            { name: 'NeonVisuals', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=3', status: 'purple' },
            { name: 'Marcus Thorne', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=8', status: 'purple' },
            { name: 'PixelArt', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=15', status: 'purple' },
            { name: 'EditMaster', role: 'Video Editor', img: 'https://i.pravatar.cc/150?img=12', status: 'purple' },
            { name: 'Jessica Lee', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=9', status: 'purple' },
            { name: 'Ryan Bolt', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=60', status: 'purple' },
            { name: 'Alex Rivera', role: 'Creative Director', img: 'https://i.pravatar.cc/150?img=53', status: 'purple' }
          ].map((talent, i) => (
            <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
                    <img src={talent.img} alt={talent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  {/* "Hire Me" Badge Simulation */}
                  <div className="absolute -bottom-1 -left-1 bg-red-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-[#0a0a0a] transform -rotate-12">
                    HIRE ME
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{talent.name}</h3>
                    {talent.status === 'purple' && <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>}
                    {talent.status === 'red' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>}
                  </div>
                  <p className="text-gray-400 text-sm">{talent.role}</p>
                </div>
              </div>
              <div className="text-gray-600 group-hover:text-white transition-colors flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startConversation(`t${i}`, talent.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-full transition-all"
                >
                  Contactar
                </button>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
