import React, { useState, useEffect } from 'react';
import { 
  Zap, Menu, X, Search, Filter, Plus, DollarSign, Users, 
  Check, Star, ArrowRight, Info, CheckCircle, AlertCircle,
  Grid, Bell, Mail, Briefcase, MapPin, Clock, ChevronDown,
  Twitter, Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType, User, Project, Proposal, Message, Conversation, Announcement, BlogPost } from './types';
import { DEMO_USERS, DEMO_PROJECTS, DEMO_PROPOSALS } from './data';
import Blog from './components/Blog';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Landing from './components/Landing';
import HowItWorks from './components/HowItWorks';
import Explore from './components/Explore';
import Talent from './components/Talent';
import DashboardCreator from './components/DashboardCreator';
import DashboardFreelancer from './components/DashboardFreelancer';
import DashboardAdmin from './components/DashboardAdmin';
import Profile from './components/Profile';
import AIAssistant from './components/AIAssistant';

export default function App() {
  // --- State ---
  const [activeSection, setActiveSection] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);

  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'post-1',
      title: 'Roadblocks to Successful Business Automation',
      excerpt: 'Automation is a powerful tool for scaling businesses, but implementing it successfully requires overcoming several common hurdles.',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
      category: 'Business',
      author: 'Admin',
      authorAvatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
      date: 'February 26, 2026',
      readTime: '5 min',
      slug: 'roadblocks-to-successful-business-automation',
      blocks: [
        { id: 'b1', type: 'paragraph', content: 'Business automation promises efficiency, cost reduction, and scalability. However, the path to a fully automated workflow is rarely smooth. Many organizations face significant roadblocks that can derail their initiatives if not addressed early.' },
        { id: 'b2', type: 'h2', content: '1. Lack of Clear Strategy' },
        { id: 'b3', type: 'paragraph', content: 'One of the most common reasons for automation failure is jumping in without a clear plan. Automating a broken process only makes it break faster. Before implementing any tool, map out your current workflows and identify exactly which parts benefit from automation.' },
        { id: 'b4', type: 'image', content: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000', caption: 'Process mapping is crucial before automation.' },
        { id: 'b5', type: 'h2', content: '2. Resistance to Change' },
        { id: 'b6', type: 'paragraph', content: 'Employees often fear that automation will replace their jobs. It is essential to communicate that automation is meant to handle repetitive tasks, freeing them up for more creative and strategic work. Training and involvement in the process can turn resistance into enthusiasm.' },
        { id: 'b7', type: 'quote', content: 'Automation is not about replacing people, but about empowering them to do more meaningful work.' },
        { id: 'b8', type: 'h2', content: '3. Integration Challenges' },
        { id: 'b9', type: 'paragraph', content: 'Modern businesses use dozens of SaaS tools. Ensuring these tools talk to each other seamlessly is often harder than expected. Choosing platforms with robust APIs and native integrations is critical for a unified ecosystem.' },
        { id: 'b10', type: 'list', content: 'Audit your current tech stack.' },
        { id: 'b11', type: 'list', content: 'Prioritize tools with open APIs.' },
        { id: 'b12', type: 'list', content: 'Consider using middleware like Zapier or Make.' }
      ]
    }
  ]);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minBudgetFilter, setMinBudgetFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [selectedProjectForProposal, setSelectedProjectForProposal] = useState<{id: string, title: string} | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  // Messaging State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      participants: ['u1', 'u2'],
      participantNames: { 'u1': 'Juan Creator', 'u2': 'Alex Editor' },
      messages: [
        { id: 'm1', senderId: 'u2', text: 'Hola Juan, vi tu proyecto de edición. ¿Sigues buscando?', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'm2', senderId: 'u1', text: 'Hola Alex, sí! Envía tu propuesta formal por favor.', timestamp: new Date(Date.now() - 1800000).toISOString() }
      ],
      unreadCount: 1,
      lastMessage: 'Hola Alex, sí! Envía tu propuesta formal por favor.',
      lastMessageTime: new Date(Date.now() - 1800000).toISOString()
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  // --- Effects ---
  useEffect(() => {
    // Load data from localStorage or init with demo data
    const loadData = () => {
      const storedUsers = localStorage.getItem('cm_users');
      const storedProjects = localStorage.getItem('cm_projects');
      const storedProposals = localStorage.getItem('cm_proposals');
      const storedAnnouncements = localStorage.getItem('cm_announcements');
      const storedCurrentUser = localStorage.getItem('cm_currentUser');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else {
        setUsers(DEMO_USERS);
        localStorage.setItem('cm_users', JSON.stringify(DEMO_USERS));
      }

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      else {
        setProjects(DEMO_PROJECTS);
        localStorage.setItem('cm_projects', JSON.stringify(DEMO_PROJECTS));
      }

      if (storedProposals) setProposals(JSON.parse(storedProposals));
      else {
        setProposals(DEMO_PROPOSALS);
        localStorage.setItem('cm_proposals', JSON.stringify(DEMO_PROPOSALS));
      }

      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));

      if (storedCurrentUser) {
        setCurrentUser(JSON.parse(storedCurrentUser));
        setActiveSection('explore');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('cm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('cm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (proposals.length > 0) localStorage.setItem('cm_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('cm_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('cm_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // --- Helpers ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('landing');
    showToast('Sesión cerrada');
  };

  const handleViewProfile = (user: User) => {
    setViewingProfileUser(user);
    setActiveSection('user-profile');
  };

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    const user = users.find(u => u.email === email);
    if (user) {
      if (user.status === 'blocked') {
        showToast('Tu cuenta ha sido bloqueada por un administrador.', 'error');
        return;
      }
      setCurrentUser(user);
      setActiveModal(null);
      showToast(`Bienvenido, ${user.name}`);
      setActiveSection('explore');
    } else {
      showToast('Usuario no encontrado (Usa demo@demo.com)', 'error');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const type = formData.get('type') as UserType;
    
    const newUser: User = {
      id: 'u' + Date.now(),
      name: formData.get('name') as string,
      lastname: formData.get('lastname') as string,
      email: formData.get('email') as string,
      type: type,
      channel: type === 'creator' ? formData.get('channel') as string : undefined,
      specialty: type === 'freelancer' ? formData.get('specialty') as string : undefined
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setActiveModal(null);
    showToast('¡Cuenta creada exitosamente!');
    setActiveSection('explore');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newProject: Project = {
      id: 'p' + Date.now(),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      budget: formData.get('budget') as string,
      description: formData.get('description') as string,
      skills: formData.get('skills') as string,
      duration: formData.get('duration') as string,
      experience: formData.get('experience') as string,
      creatorId: currentUser.id,
      creatorName: currentUser.channel || currentUser.name,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setProjects([newProject, ...projects]);
    setActiveModal(null);
    showToast('¡Proyecto publicado exitosamente!');
    setActiveSection('dashboard-creator');
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedProjectForProposal) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newProposal: Proposal = {
      id: 'prop' + Date.now(),
      projectId: selectedProjectForProposal.id,
      freelancerId: currentUser.id,
      freelancerName: `${currentUser.name} ${currentUser.lastname}`,
      coverLetter: formData.get('coverLetter') as string,
      price: formData.get('price') as string,
      time: formData.get('time') as string,
      portfolio: formData.get('portfolio') as string,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setProposals([...proposals, newProposal]);
    setActiveModal(null);
    showToast('¡Propuesta enviada con éxito!');
  };

  const updateProposalStatus = (propId: string, status: 'accepted' | 'rejected') => {
    const proposal = proposals.find(p => p.id === propId);
    if (!proposal) return;

    setProposals(proposals.map(p => p.id === propId ? { ...p, status } : p));
    
    if (status === 'accepted') {
      // Update project status to 'in-progress'
      setProjects(projects.map(p => p.id === proposal.projectId ? { ...p, status: 'in-progress' } : p)); 
      showToast('Propuesta aceptada. El proyecto está ahora en progreso.');
    } else {
      showToast('Propuesta rechazada');
    }
  };

  const markProjectCompleted = (projectId: string) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));
    showToast('¡Proyecto marcado como completado!');
  };

  // --- Admin Actions ---
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'blocked' ? 'active' : 'blocked';
        showToast(`Usuario ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    showToast('Proyecto eliminado');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newAnnouncement: Announcement = {
      id: 'a' + Date.now(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      createdAt: new Date().toISOString(),
      active: true
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setActiveModal(null);
    showToast('Anuncio publicado');
  };

  const handleToggleAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Update local state
    setCurrentUser(updatedUser);
    
    // Update users list
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    // Persist
    localStorage.setItem('cm_currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('cm_users', JSON.stringify(updatedUsers));
    
    showToast('Perfil actualizado con éxito');
  };

  // --- Blog Actions ---
  const handleSaveBlogPost = (post: BlogPost) => {
    const exists = blogPosts.find(p => p.id === post.id);
    if (exists) {
      setBlogPosts(blogPosts.map(p => p.id === post.id ? post : p));
      showToast('Artículo actualizado');
    } else {
      setBlogPosts([post, ...blogPosts]);
      showToast('Artículo publicado');
    }
  };

  const handleDeleteBlogPost = (id: string) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
    showToast('Artículo eliminado');
  };

  // --- Messaging Helpers ---
  const sendMessage = () => {
    if (!newMessageText.trim() || !activeConversationId || !currentUser) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: newMessageText,
      timestamp: new Date().toISOString()
    };

    setConversations(conversations.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: newMsg.text,
          lastMessageTime: newMsg.timestamp,
          unreadCount: 0 // Reset unread since we are replying
        };
      }
      return c;
    }));

    setNewMessageText('');
  };

  const startConversation = (targetUserId: string, targetUserName: string) => {
    if (!currentUser) {
      setActiveModal('login');
      return;
    }

    // Check if conversation exists
    const existingConv = conversations.find(c => c.participants.includes(currentUser.id) && c.participants.includes(targetUserId));
    
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveSection('inbox');
    } else {
      // Create new conversation
      const newConv: Conversation = {
        id: `c${Date.now()}`,
        participants: [currentUser.id, targetUserId],
        participantNames: { [currentUser.id]: currentUser.name, [targetUserId]: targetUserName },
        messages: [],
        unreadCount: 0,
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      };
      setConversations([...conversations, newConv]);
      setActiveConversationId(newConv.id);
      setActiveSection('inbox');
    }
  };

  // --- Render Helpers ---
  const filteredProjects = projects.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Budget filter (simple check if project budget string contains numbers >= minBudget)
    // This is a basic implementation. For real apps, budget should be structured.
    let matchesBudget = true;
    if (minBudgetFilter) {
      const budgetNums = p.budget.match(/\d+/g);
      if (budgetNums) {
        const maxBudgetInProject = Math.max(...budgetNums.map(Number));
        matchesBudget = maxBudgetInProject >= Number(minBudgetFilter);
      }
    }

    const matchesExp = experienceFilter === 'all' || p.experience === experienceFilter;

    return matchesCat && matchesSearch && matchesBudget && matchesExp;
  });

  const closeProject = (projectId: string) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'closed' } : p));
    showToast('Proyecto cerrado exitosamente');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white font-sans">
      
      <Navigation 
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setActiveModal={setActiveModal}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        announcements={announcements}
      />

      {/* --- Main Content --- */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* INBOX */}
        {activeSection === 'inbox' && currentUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto min-h-[80vh] grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="font-bold text-lg">Mensajes</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.filter(c => c.participants.includes(currentUser.id)).length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No tienes mensajes aún.</div>
                ) : (
                  conversations.filter(c => c.participants.includes(currentUser.id)).map(conv => {
                    const otherUserId = conv.participants.find(p => p !== currentUser.id) || '';
                    const otherUserName = conv.participantNames[otherUserId] || 'Usuario';
                    const isActive = activeConversationId === conv.id;
                    
                    return (
                      <div 
                        key={conv.id} 
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition ${isActive ? 'bg-white/10 border-l-4 border-l-indigo-500' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{otherUserName}</h4>
                          <span className="text-xs text-gray-500">{new Date(conv.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conv.lastMessage || 'Nueva conversación'}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col h-[600px]">
              {activeConversationId ? (
                <>
                  {(() => {
                    const activeConv = conversations.find(c => c.id === activeConversationId);
                    const otherUserId = activeConv?.participants.find(p => p !== currentUser.id) || '';
                    const otherUserName = activeConv?.participantNames[otherUserId] || 'Usuario';
                    
                    return (
                      <>
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                              {otherUserName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-white">{otherUserName}</h3>
                              <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> En línea
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                          {activeConv?.messages.map(msg => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                  <p>{msg.text}</p>
                                  <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-500'} text-right`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          {activeConv?.messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                              <p>Inicia la conversación con {otherUserName}</p>
                            </div>
                          )}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-white/5">
                          <form 
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex gap-2"
                          >
                            <input 
                              type="text" 
                              value={newMessageText}
                              onChange={(e) => setNewMessageText(e.target.value)}
                              placeholder="Escribe un mensaje..." 
                              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                            />
                            <button 
                              type="submit"
                              disabled={!newMessageText.trim()}
                              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </form>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Selecciona una conversación para empezar a chatear</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* LANDING */}
        {activeSection === 'landing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto w-full min-h-[80vh] flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-indigo-400">Más de 1,200 creadores conectados</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  Encuentra al <span className="gradient-text">talento perfecto</span> para tu canal
                </h1>
                
                <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                  Conecta con editores, diseñadores, guionistas y más. 
                  Publica tu proyecto y recibe propuestas de los mejores profesionales del contenido.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => currentUser ? setActiveSection('dashboard-creator') : setActiveModal('register')} className="btn-primary px-8 py-4 rounded-full text-lg font-semibold text-white flex items-center justify-center gap-2">
                    <span>Publicar un Proyecto</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => setActiveSection('explore')} className="px-8 py-4 rounded-full text-lg font-semibold border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2">
                    <span>Ver Proyectos</span>
                    <Search className="w-5 h-5" />
                  </button>
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
        )}

        {/* JOBS BOARD (EXPLORE) */}
        {activeSection === 'explore' && (
          <Explore 
            currentUser={currentUser}
            projects={projects}
            setActiveModal={setActiveModal}
            setViewingProject={setViewingProject}
            viewingProject={viewingProject}
            setSelectedProjectForProposal={setSelectedProjectForProposal}
            showToast={showToast}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* TALENT BOARD */}
        {activeSection === 'talent' && (
          <Talent 
            setActiveModal={setActiveModal}
            startConversation={startConversation}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* DASHBOARD CREATOR */}
        {activeSection === 'dashboard-creator' && currentUser?.type === 'creator' && (
          <DashboardCreator 
            currentUser={currentUser}
            projects={projects}
            proposals={proposals}
            setActiveModal={setActiveModal}
            closeProject={closeProject}
            markProjectCompleted={markProjectCompleted}
            updateProposalStatus={updateProposalStatus}
            startConversation={startConversation}
          />
        )}

        {/* DASHBOARD FREELANCER */}
        {activeSection === 'dashboard-freelancer' && currentUser?.type === 'freelancer' && (
          <DashboardFreelancer 
            currentUser={currentUser}
            proposals={proposals}
            projects={projects}
            setActiveSection={setActiveSection}
          />
        )}

        {/* DASHBOARD ADMIN */}
        {activeSection === 'dashboard-admin' && currentUser?.type === 'admin' && (
          <DashboardAdmin 
            currentUser={currentUser}
            users={users}
            projects={projects}
            proposals={proposals}
            announcements={announcements}
            blogPosts={blogPosts}
            setActiveModal={setActiveModal}
            handleToggleUserStatus={handleToggleUserStatus}
            handleDeleteProject={handleDeleteProject}
            handleToggleAnnouncement={handleToggleAnnouncement}
            onSaveBlogPost={handleSaveBlogPost}
            onDeleteBlogPost={handleDeleteBlogPost}
          />
        )}

        {/* PROFILE (Current User) */}
        {activeSection === 'profile' && currentUser && (
          <Profile 
            currentUser={currentUser} 
            onUpdateUser={handleUpdateUser} 
            isOwnProfile={true}
          />
        )}

        {/* USER PROFILE (Viewing Other) */}
        {activeSection === 'user-profile' && viewingProfileUser && (
          <Profile 
            currentUser={viewingProfileUser} 
            isOwnProfile={currentUser?.id === viewingProfileUser.id}
            startConversation={startConversation}
          />
        )}

        {/* HOW IT WORKS */}
        {activeSection === 'how-it-works' && <HowItWorks />}

        {/* BLOG */}
        {activeSection === 'blog' && <Blog blogPosts={blogPosts} />}

      </main>

      {/* Footer */}
      <Footer setActiveSection={setActiveSection} />

      {/* --- Modals --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl p-8 w-full max-w-md relative border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>

              {/* Login Modal */}
              {activeModal === 'login' && (
                <>
                  <h3 className="text-2xl font-bold mb-2 text-center">Bienvenido de vuelta</h3>
                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                      <input type="email" name="email" required className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" placeholder="demo@demo.com" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6">Iniciar Sesión</button>
                  </form>
                  <div className="mt-6 text-center text-sm text-gray-400">
                    ¿No tienes cuenta? <button onClick={() => setActiveModal('register')} className="text-indigo-400 hover:text-indigo-300 font-medium">Regístrate</button>
                  </div>
                </>
              )}

              {/* Register Modal */}
              {activeModal === 'register' && (
                <>
                  <h3 className="text-2xl font-bold mb-2 text-center">Crear Cuenta</h3>
                  <form onSubmit={handleRegister} className="space-y-4 mt-6">
                    <div className="flex gap-2 mb-4">
                      <label className="flex-1 cursor-pointer">
                        <input type="radio" name="type" value="creator" defaultChecked className="peer hidden" />
                        <div className="py-2 text-center rounded-lg border border-white/10 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition">Soy Creador</div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input type="radio" name="type" value="freelancer" className="peer hidden" />
                        <div className="py-2 text-center rounded-lg border border-white/10 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition">Soy Freelancer</div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="name" required placeholder="Nombre" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                      <input type="text" name="lastname" required placeholder="Apellido" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    </div>
                    <input type="email" name="email" required placeholder="Email" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <input type="text" name="channel" placeholder="Nombre del Canal (Opcional)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6">Registrarse</button>
                  </form>
                </>
              )}

              {/* Create Announcement Modal */}
        <AnimatePresence>
          {activeModal === 'createAnnouncement' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-full max-w-md relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                <h2 className="text-2xl font-bold mb-6">Nuevo Anuncio</h2>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Título del Anuncio</label>
                    <input name="title" required className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="Ej. Mantenimiento programado" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contenido</label>
                    <textarea name="content" required rows={4} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none" placeholder="Detalles del anuncio..."></textarea>
                  </div>
                  <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-white mt-6">Publicar Anuncio</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Project Modal */}
              {activeModal === 'createProject' && (
                <>
                  <h3 className="text-2xl font-bold mb-2">Publicar Proyecto</h3>
                  <form onSubmit={handleCreateProject} className="space-y-4 mt-6">
                    <input type="text" name="title" required placeholder="Título del Proyecto" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <select name="category" className="input-field w-full px-4 py-3 rounded-xl text-white bg-gray-900">
                        <option value="editing">Edición</option>
                        <option value="thumbnail">Miniaturas</option>
                        <option value="script">Guiones</option>
                      </select>
                      <input type="text" name="budget" required placeholder="Presupuesto" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    </div>
                    <textarea name="description" required rows={3} placeholder="Descripción" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none"></textarea>
                    <input type="text" name="skills" required placeholder="Habilidades (sep. por comas)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6">Publicar</button>
                  </form>
                </>
              )}

              {/* Proposal Modal */}
              {activeModal === 'proposal' && (
                <>
                  <h3 className="text-2xl font-bold mb-2">Enviar Propuesta</h3>
                  <p className="text-sm text-gray-400 mb-4">Para: {selectedProjectForProposal?.title}</p>
                  <form onSubmit={handleSubmitProposal} className="space-y-4">
                    <textarea name="coverLetter" required rows={4} placeholder="¿Por qué eres el indicado?" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none"></textarea>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="price" required placeholder="Tu Precio ($)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                      <select name="time" required className="input-field w-full px-4 py-3 rounded-xl text-white bg-gray-900">
                        <option value="24h">24 Horas</option>
                        <option value="3d">3 Días</option>
                        <option value="1w">1 Semana</option>
                        <option value="2w">2 Semanas</option>
                        <option value="1m">1 Mes</option>
                      </select>
                    </div>
                    <input type="url" name="portfolio" required placeholder="Link de Portafolio" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6">Enviar Propuesta</button>
                  </form>
                </>
              )}

              {/* Filter Modal */}
              {activeModal === 'filter' && (
                <>
                  <h3 className="text-2xl font-bold mb-6">Filtrar Proyectos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Presupuesto Mínimo ($)</label>
                      <input 
                        type="number" 
                        value={minBudgetFilter}
                        onChange={(e) => setMinBudgetFilter(e.target.value)}
                        placeholder="Ej: 100" 
                        className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Nivel de Experiencia</label>
                      <select 
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                        className="input-field w-full px-4 py-3 rounded-xl text-white bg-gray-900"
                      >
                        <option value="all">Cualquiera</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Intermedio</option>
                        <option value="senior">Senior</option>
                        <option value="expert">Experto</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)} 
                      className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6"
                    >
                      Aplicar Filtros
                    </button>
                    <button 
                      onClick={() => {
                        setMinBudgetFilter('');
                        setExperienceFilter('all');
                        setActiveModal(null);
                      }} 
                      className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white mt-2"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Toast --- */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-4 right-4 z-50 glass-card p-4 rounded-xl border-l-4 ${toast.type === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'} flex items-center gap-3 shadow-lg`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm text-white">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant currentUser={currentUser} projects={projects} />

    </div>
  );
}
