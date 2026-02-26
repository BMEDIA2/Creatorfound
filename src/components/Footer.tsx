import React from 'react';
import { Zap, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CreatorMatch</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Conectando a los mejores creadores de contenido con profesionales de élite para construir el futuro del entretenimiento digital.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Explorar Trabajos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Top Talentos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cómo Funciona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Precios</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Recursos</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Guías para Creadores</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Términos y Privacidad</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CreatorMatch. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
