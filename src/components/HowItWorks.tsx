import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto text-center py-12">
      <h2 className="text-4xl font-bold mb-4">Cómo Funciona</h2>
      <p className="text-xl text-gray-400 mb-12">Conecta con el talento perfecto en 4 simples pasos</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { step: 1, title: 'Publica', desc: 'Describe lo que necesitas y tu presupuesto.', color: 'from-indigo-500 to-purple-600' },
          { step: 2, title: 'Recibe', desc: 'Profesionales envían sus propuestas.', color: 'from-purple-500 to-pink-600' },
          { step: 3, title: 'Contrata', desc: 'Elige al mejor candidato para tu proyecto.', color: 'from-pink-500 to-red-600' },
          { step: 4, title: 'Trabaja', desc: 'Gestiona el proyecto y pagos en la plataforma.', color: 'from-blue-500 to-cyan-600' }
        ].map((item) => (
          <div key={item.step} className="glass-card rounded-2xl p-8 hover-lift">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}>{item.step}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
