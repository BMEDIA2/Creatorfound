import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Briefcase, CheckCircle, X, FileText, Edit, Trash2 } from 'lucide-react';
import { Project, Proposal, User, Announcement, BlogPost } from '../types';
import BlogEditor from './BlogEditor';

interface DashboardAdminProps {
  currentUser: User;
  users: User[];
  projects: Project[];
  proposals: Proposal[];
  announcements: Announcement[];
  blogPosts: BlogPost[];
  setActiveModal: (modal: string | null) => void;
  handleToggleUserStatus: (userId: string) => void;
  handleDeleteProject: (projectId: string) => void;
  handleToggleAnnouncement: (id: string) => void;
  onSaveBlogPost: (post: BlogPost) => void;
  onDeleteBlogPost: (id: string) => void;
}

export default function DashboardAdmin({
  currentUser,
  users,
  projects,
  proposals,
  announcements,
  blogPosts,
  setActiveModal,
  handleToggleUserStatus,
  handleDeleteProject,
  handleToggleAnnouncement,
  onSaveBlogPost,
  onDeleteBlogPost
}: DashboardAdminProps) {
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | undefined>(undefined);

  const handleEditPost = (post?: BlogPost) => {
    setCurrentPost(post);
    setIsEditingBlog(true);
  };

  const handleSavePost = (post: BlogPost) => {
    onSaveBlogPost(post);
    setIsEditingBlog(false);
    setCurrentPost(undefined);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
      <AnimatePresence>
        {isEditingBlog && (
          <BlogEditor
            post={currentPost}
            onSave={handleSavePost}
            onCancel={() => setIsEditingBlog(false)}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Panel de Administración</h2>
          <p className="text-gray-400">Gestiona usuarios, proyectos, anuncios y blog</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleEditPost()} className="btn-primary px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Nuevo Artículo</span>
          </button>
          <button onClick={() => setActiveModal('createAnnouncement')} className="glass-card px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2 hover:bg-white/5 transition">
            <Plus className="w-5 h-5" />
            <span>Nuevo Anuncio</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Users className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Usuarios</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{users.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Briefcase className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Proyectos</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{projects.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><CheckCircle className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Propuestas</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{proposals.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400"><FileText className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Artículos</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{blogPosts.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Users Management */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-6">Gestión de Usuarios</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {users.map(u => (
              <div key={u.id} className="bg-[#111111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {u.name} {u.lastname}
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 uppercase">{u.type}</span>
                  </div>
                  <div className="text-sm text-gray-400">{u.email}</div>
                </div>
                {u.id !== currentUser.id ? (
                  <button
                    onClick={() => handleToggleUserStatus(u.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${u.status === 'blocked' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                  >
                    {u.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded">Tú</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects Management */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-6">Gestión de Proyectos</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {projects.map(p => (
              <div key={p.id} className="bg-[#111111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="font-bold text-white line-clamp-1">{p.title}</div>
                  <div className="text-sm text-gray-400">Por: {p.creatorName} • {p.status}</div>
                </div>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                  title="Borrar Proyecto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500 italic text-center">No hay proyectos.</p>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Blog Management */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-6">Gestión del Blog</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-[#111111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="font-bold text-white line-clamp-1">{post.title}</div>
                  <div className="text-sm text-gray-400">{post.date} • {post.category}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBlogPost(post.id)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                    title="Borrar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {blogPosts.length === 0 && <p className="text-gray-500 italic text-center">No hay artículos.</p>}
          </div>
        </div>

        {/* Announcements Management */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-6">Anuncios Globales</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {announcements.map(a => (
              <div key={a.id} className={`bg-[#111111] p-4 rounded-xl border ${a.active ? 'border-indigo-500/30' : 'border-white/5'} flex justify-between items-start`}>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {a.title}
                    {!a.active && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase">Inactivo</span>}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{a.content}</div>
                  <div className="text-xs text-gray-500 mt-2">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => handleToggleAnnouncement(a.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition ${!a.active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                >
                  {a.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-gray-500 italic text-center">No hay anuncios.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
