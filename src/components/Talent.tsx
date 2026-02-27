import React from 'react';
import { motion } from 'framer-motion';
import { Filter, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface TalentProps {
  setActiveModal: (modal: string | null) => void;
  startConversation: (userId: string, userName: string) => void;
  onViewProfile: (user: User) => void;
}

export default function Talent({ setActiveModal, startConversation, onViewProfile }: TalentProps) {
  const talents = [
    { name: 'Sarah Jenkins', role: 'Creative Director', img: 'https://i.pravatar.cc/150?img=5', status: 'red' },
    { name: 'Kai Takagi', role: 'Channel Manager', img: 'https://i.pravatar.cc/150?img=11', status: 'purple' },
    { name: 'NeonVisuals', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=3', status: 'purple' },
    { name: 'Marcus Thorne', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=8', status: 'purple' },
    { name: 'PixelArt', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=15', status: 'purple' },
    { name: 'EditMaster', role: 'Video Editor', img: 'https://i.pravatar.cc/150?img=12', status: 'purple' },
    { name: 'Jessica Lee', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=9', status: 'purple' },
    { name: 'Ryan Bolt', role: 'Thumbnail Designer', img: 'https://i.pravatar.cc/150?img=60', status: 'purple' },
    { name: 'Alex Rivera', role: 'Creative Director', img: 'https://i.pravatar.cc/150?img=53', status: 'purple' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <h1 className="text-4xl font-bold text-white">Talent</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveModal('filter')}
            className="px-4 py-2.5 rounded-lg border border-white/10 bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 hover:text-white transition flex items-center gap-2 text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((talent, i) => (
          <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 transition-all cursor-pointer">
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
    </motion.div>
  );
}
