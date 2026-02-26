import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { User, Project } from '../types';

interface AIAssistantProps {
  currentUser: User | null;
  projects: Project[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AIAssistant({ currentUser, projects }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: '¡Hola! Soy tu asistente de CreatorMatch. 🤖\n\nPuedo ayudarte a encontrar proyectos ideales para ti, explicarte cómo funciona la plataforma o resolver cualquier duda.\n\n¿En qué te puedo ayudar hoy?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Prepare context about the platform and data
      const projectContext = projects.map(p => 
        `- Proyecto: "${p.title}" (${p.category})\n  Presupuesto: ${p.budget}\n  Habilidades: ${p.skills}\n  Descripción: ${p.description.substring(0, 100)}...`
      ).join('\n\n');

      const userContext = currentUser 
        ? `El usuario actual es ${currentUser.name} ${currentUser.lastname}, rol: ${currentUser.type}. Especialidad: ${currentUser.specialty || 'No definida'}. Habilidades: ${currentUser.skills?.join(', ') || 'No definidas'}.`
        : 'El usuario no ha iniciado sesión.';

      const systemInstruction = `
        Eres el asistente virtual oficial de CreatorMatch, una plataforma que conecta Creadores de Contenido con Freelancers (editores, guionistas, diseñadores, etc.).
        
        Tu objetivo es ser amable, profesional y extremadamente útil.
        
        CONTEXTO ACTUAL:
        ${userContext}
        
        PROYECTOS DISPONIBLES EN LA PLATAFORMA:
        ${projectContext}
        
        INSTRUCCIONES:
        1. Si el usuario es un Freelancer, ayúdale a encontrar proyectos que coincidan con sus habilidades. Recomienda proyectos específicos de la lista anterior.
        2. Si el usuario es un Creador, dale consejos sobre cómo publicar proyectos atractivos o cómo seleccionar talento.
        3. Responde preguntas generales sobre la plataforma (cómo funciona, pagos, seguridad, etc.).
        4. Mantén las respuestas concisas y fáciles de leer. Usa emojis ocasionalmente para ser amigable.
        5. Si te preguntan algo fuera del contexto de la plataforma, responde educadamente que solo puedes ayudar con temas relacionados con CreatorMatch.
        
        IMPORTANTE:
        - Si recomiendas un proyecto, menciona su título y presupuesto.
        - Sé proactivo sugiriendo pasos a seguir.
      `;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMessage.text });
      const text = result.text;

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: text || 'Lo siento, no pude generar una respuesta.'
      }]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Lo siento, tuve un problema al procesar tu solicitud. Por favor intenta de nuevo más tarde.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center border border-white/10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] max-h-[80vh] bg-[#111111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Asistente CreatorMatch</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-gray-300">En línea</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs text-gray-400">Escribiendo...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111111] border-t border-white/10">
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none h-12 max-h-32"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-600">
                  Potenciado por Gemini AI. Puede cometer errores.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
