import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Image as ImageIcon, Type, Quote, List, Trash2, ArrowUp, ArrowDown, Save, AlignLeft } from 'lucide-react';
import { BlogPost, BlogBlock, BlogBlockType } from '../types';

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  currentUser: { name: string; lastname: string; };
}

export default function BlogEditor({ post, onSave, onCancel, currentUser }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [category, setCategory] = useState(post?.category || 'General');
  const [readTime, setReadTime] = useState(post?.readTime || '5 min');
  const [blocks, setBlocks] = useState<BlogBlock[]>(post?.blocks || [
    { id: 'b1', type: 'paragraph', content: '' }
  ]);

  const addBlock = (type: BlogBlockType) => {
    setBlocks([...blocks, { id: `b${Date.now()}`, type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const updateBlockCaption = (id: string, caption: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, caption } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + (direction === 'up' ? -1 : 1)];
    newBlocks[index + (direction === 'up' ? -1 : 1)] = temp;
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    const newPost: BlogPost = {
      id: post?.id || `post-${Date.now()}`,
      title,
      excerpt,
      coverImage,
      category,
      author: post?.author || `${currentUser.name} ${currentUser.lastname}`,
      authorAvatar: post?.authorAvatar || 'https://picsum.photos/seed/admin/100/100',
      date: post?.date || new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime,
      blocks,
      slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    };
    onSave(newPost);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[200] bg-[#0a0a0a] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md py-4 z-10 border-b border-white/10">
          <h2 className="text-2xl font-bold">Editor de Artículos</h2>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-xl font-bold text-white flex items-center gap-2">
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </div>

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="input-field w-full px-4 py-3 rounded-xl text-white text-xl font-bold placeholder-gray-600" 
                placeholder="Título del Artículo" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Extracto</label>
              <textarea 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)} 
                rows={3}
                className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 resize-none" 
                placeholder="Breve descripción para la tarjeta..." 
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Imagen de Portada (URL)</label>
              <div className="flex gap-2">
                <input 
                  value={coverImage} 
                  onChange={e => setCoverImage(e.target.value)} 
                  className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-600" 
                  placeholder="https://..." 
                />
              </div>
              {coverImage && (
                <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-white/10">
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-600" 
                  placeholder="Ej. Tecnología" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tiempo de Lectura</label>
                <input 
                  value={readTime} 
                  onChange={e => setReadTime(e.target.value)} 
                  className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-600" 
                  placeholder="Ej. 5 min" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-8"></div>

        {/* Blocks Editor */}
        <div className="space-y-6 min-h-[500px]">
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative pl-12 pr-4 py-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
              {/* Block Controls */}
              <div className="absolute left-2 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => removeBlock(block.id)} className="p-1 text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* Block Content */}
              <div className="w-full">
                {block.type === 'paragraph' && (
                  <textarea 
                    value={block.content} 
                    onChange={e => updateBlock(block.id, e.target.value)} 
                    className="w-full bg-transparent text-gray-300 text-lg leading-relaxed focus:outline-none resize-none" 
                    placeholder="Escribe un párrafo..." 
                    rows={Math.max(2, block.content.split('\n').length)}
                  />
                )}
                {block.type === 'h1' && (
                  <input 
                    value={block.content} 
                    onChange={e => updateBlock(block.id, e.target.value)} 
                    className="w-full bg-transparent text-white text-4xl font-bold focus:outline-none" 
                    placeholder="Encabezado Grande" 
                  />
                )}
                {block.type === 'h2' && (
                  <input 
                    value={block.content} 
                    onChange={e => updateBlock(block.id, e.target.value)} 
                    className="w-full bg-transparent text-white text-2xl font-bold focus:outline-none" 
                    placeholder="Subtítulo" 
                  />
                )}
                {block.type === 'quote' && (
                  <div className="flex gap-4">
                    <div className="w-1 bg-indigo-500 rounded-full"></div>
                    <textarea 
                      value={block.content} 
                      onChange={e => updateBlock(block.id, e.target.value)} 
                      className="w-full bg-transparent text-xl italic text-gray-300 focus:outline-none resize-none" 
                      placeholder="Cita destacada..." 
                      rows={Math.max(2, block.content.split('\n').length)}
                    />
                  </div>
                )}
                {block.type === 'image' && (
                  <div className="space-y-2">
                    <input 
                      value={block.content} 
                      onChange={e => updateBlock(block.id, e.target.value)} 
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500" 
                      placeholder="URL de la imagen..." 
                    />
                    {block.content && (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 mt-2">
                        <img src={block.content} alt="Block preview" className="w-full h-auto max-h-[500px] object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <input 
                      value={block.caption || ''} 
                      onChange={e => updateBlockCaption(block.id, e.target.value)} 
                      className="w-full bg-transparent text-center text-sm text-gray-500 focus:outline-none mt-1" 
                      placeholder="Pie de foto (opcional)" 
                    />
                  </div>
                )}
                {block.type === 'list' && (
                  <div className="flex gap-2">
                    <span className="text-indigo-400 mt-1">•</span>
                    <textarea 
                      value={block.content} 
                      onChange={e => updateBlock(block.id, e.target.value)} 
                      className="w-full bg-transparent text-gray-300 text-lg focus:outline-none resize-none" 
                      placeholder="Elemento de lista..." 
                      rows={1}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Block Controls */}
        <div className="flex justify-center gap-2 mt-8 py-8 border-t border-white/10 border-dashed">
          <button onClick={() => addBlock('paragraph')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-xs">
            <AlignLeft className="w-5 h-5" /> Texto
          </button>
          <button onClick={() => addBlock('h2')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-xs">
            <Type className="w-5 h-5" /> Título
          </button>
          <button onClick={() => addBlock('image')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-xs">
            <ImageIcon className="w-5 h-5" /> Imagen
          </button>
          <button onClick={() => addBlock('quote')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-xs">
            <Quote className="w-5 h-5" /> Cita
          </button>
          <button onClick={() => addBlock('list')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-xs">
            <List className="w-5 h-5" /> Lista
          </button>
        </div>

      </div>
    </motion.div>
  );
}
