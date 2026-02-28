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
import CreateProjectForm from './components/CreateProjectForm';
import Talent from './components/Talent';
import DashboardCreator from './components/DashboardCreator';
import DashboardFreelancer from './components/DashboardFreelancer';
import DashboardAdmin from './components/DashboardAdmin';
import Profile from './components/Profile';
import AIAssistant from './components/AIAssistant';
import ApplyProposal from './components/ApplyProposal';
import { LogIn } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  // --- State ---
  const [activeSection, setActiveSection] = useState(localStorage.getItem('cf_active_section') || 'explore');
  const [previousSection, setPreviousSection] = useState<string | null>(null);
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
  const [authLoading, setAuthLoading] = useState(true);
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
  const [selectedProjectForProposal, setSelectedProjectForProposal] = useState<{ id: string, title: string } | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [projectToApply, setProjectToApply] = useState<Project | null>(null);

  // Messaging State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  // Persist active section
  useEffect(() => {
    localStorage.setItem('cf_active_section', activeSection);
  }, [activeSection]);


  // --- Effects ---
  // --- Effects ---
  useEffect(() => {
    // 1. Fetch data that is public or needed for initial render
    const fetchPublicData = async () => {
      if (!supabase) return;

      try {
        // Fetch users
        const { data: usersData } = await supabase.from('users').select('*');
        if (usersData && usersData.length > 0) {
          setUsers(usersData);
        } else {
          setUsers(DEMO_USERS);
        }

        // Fetch projects
        const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData);
        } else {
          setProjects(DEMO_PROJECTS);
        }

        // Fetch announcements
        const { data: announcementsData } = await supabase.from('announcements').select('*');
        if (announcementsData) setAnnouncements(announcementsData);

        // Fetch blog posts
        const { data: blogsData } = await supabase.from('blog_posts').select('*');
        if (blogsData && blogsData.length > 0) setBlogPosts(blogsData);

      } catch (err) {
        console.error("Error fetching public data from Supabase:", err);
      }
    };

    fetchPublicData();

    // 2. Listen for Auth State Changes (Single Source of Truth for Session)
    let subscription: { unsubscribe: () => void } | null = null;

    // Safety timeout: don't stay in loading forever if Supabase fails to respond
    const loadingTimeout = setTimeout(() => {
      setAuthLoading(false);
    }, 5000);

    const handleAuthState = async (event: string, session: any) => {
      try {
        if (session?.user) {
          const { user } = session;

          // Always fetch user from DB first to get correct role/type
          const { data: dbUser } = await supabase.from('users').select('*').eq('id', user.id).single();

          if (dbUser) {
            setCurrentUser(dbUser);
          } else {
            // New user via OAuth
            const newUser: User = {
              id: user.id,
              name: user.user_metadata.full_name?.split(' ')[0] || 'Usuario',
              lastname: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
              email: user.email || '',
              type: 'freelancer',
              status: 'active',
              avatar: user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata.full_name || 'User')}`
            };
            await supabase.from('users').upsert([newUser]);
            setCurrentUser(newUser);
            setUsers(prev => prev.find(u => u.id === newUser.id) ? prev : [...prev, newUser]);
          }

          if (event === 'SIGNED_IN') {
            setActiveSection('explore');
            setActiveModal(null);
          }
        } else {
          setCurrentUser(null);
          setProposals(DEMO_PROPOSALS);
          setConversations([]);
          if (event === 'SIGNED_OUT') {
            setActiveSection('explore');
          }
        }
      } catch (err) {
        console.error("Auth handler error:", err);
      } finally {
        setAuthLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    if (supabase) {
      // Set up listener
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        handleAuthState(event, session);
      });
      subscription = data.subscription;

      // Fallback: Manually check session in case listener doesn't fire INITIAL_SESSION correctly/quickly
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleAuthState('INITIAL_SESSION', session);
        } else {
          setAuthLoading(false);
          clearTimeout(loadingTimeout);
        }
      });
    } else {
      setAuthLoading(false);
      clearTimeout(loadingTimeout);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // 3. Reactive effect for Private Data (Depends on currentUser)
  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!supabase || !currentUser) return;

      try {
        // Fetch proposals for this user or projects owned by this user
        const { data: proposalsData } = await supabase.from('proposals').select('*');
        if (proposalsData && proposalsData.length > 0) {
          setProposals(proposalsData);
        }

        // Fetch conversations and messages
        const { data: conversationsData } = await supabase.from('conversations').select('*');
        const { data: messagesData } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });

        if (conversationsData && conversationsData.length > 0) {
          const mappedConversations = conversationsData
            .filter((conv: any) => conv.participants.includes(currentUser.id))
            .map((conv: any) => ({
              id: conv.id,
              participants: conv.participants || [],
              participantNames: conv.participant_names || {},
              lastMessage: conv.last_message || '',
              lastMessageTime: conv.last_message_time || new Date().toISOString(),
              unreadCount: conv.unread_count || 0,
              messages: (messagesData || [])
                .filter((m: any) => m.conversation_id === conv.id)
                .map((m: any) => ({
                  id: m.id,
                  senderId: m.sender_id,
                  text: m.text,
                  timestamp: m.timestamp
                }))
            }));
          setConversations(mappedConversations);
        }
      } catch (err) {
        console.error("Error fetching private data:", err);
      }
    };

    fetchPrivateData();
  }, [currentUser?.id]);

  // --- Helpers ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
    setProposals(DEMO_PROPOSALS);
    setConversations([]);
    setActiveSection('landing');
    showToast('Sesión cerrada');
  };

  const handleViewProfile = (user: User) => {
    setViewingProfileUser(user);
    setPreviousSection(activeSection);
    setActiveSection('user-profile');
  };

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Error de conexión a Supabase.", "error"); return;
    }
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast(`Error al iniciar sesión: ${error.message}`, 'error');
      return;
    }

    if (data.session) {
      setActiveModal(null);
      showToast(`¡Bienvenido de vuelta!`);
      setActiveSection('explore');
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      showToast("Error: Configuración de Supabase no encontrada. Revisa tu archivo .env", "error");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      showToast(`Error al conectar con Google: ${error.message}`, 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Error de conexión a Supabase.", "error"); return;
    }
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const type = formData.get('type') as UserType;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${name} ${lastname}`,
          user_type: type
        }
      }
    });

    if (error) {
      if (error.status === 429) {
        showToast('Demasiados intentos de registro. Por favor, espera un momento o usa Google.', 'error');
      } else {
        showToast(`Error: ${error.message}`, 'error');
      }
      return;
    }

    if (authData.user) {
      const newUser: User = {
        id: authData.user.id,
        name,
        lastname,
        email,
        type,
        channel: type === 'creator' ? formData.get('channel') as string : undefined,
        status: 'active',
        avatar: `https://ui-avatars.com/api/?name=${name}+${lastname}&background=random`
      };

      // Force insert into our custom table just in case the auth trigger is delayed or email confirmation is required
      await supabase.from('users').upsert([newUser]);

      if (authData.session) {
        setUsers(prev => {
          if (!prev.find(u => u.id === newUser.id)) return [...prev, newUser];
          return prev;
        });
        setCurrentUser(newUser);
        setActiveModal(null);
        showToast('¡Cuenta creada exitosamente!');
        setActiveSection('explore');
      } else {
        setActiveModal(null);
        showToast('Cuenta creada. Inicia sesión o revisa tu correo para confirmar.');
      }
    }
  };

  const handleCreateProject = async (newProjectData: any) => {
    if (!currentUser || !supabase) return;

    try {
      const { data, error } = await supabase.from('projects').insert([{
        ...newProjectData,
        creator_id: currentUser.id,
        creator_name: `${currentUser.name} ${currentUser.lastname}`,
        status: 'active'
      }]).select().single();

      if (error) throw error;

      if (data) {
        const newProject: Project = { ...data, creatorId: data.creator_id, creatorName: data.creator_name };
        setProjects(prev => [newProject, ...prev]);
        setActiveSection('dashboard-creator');
        showToast('¡Proyecto creado con éxito!');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      showToast('Error al crear el proyecto', 'error');
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !projectToApply || !supabase) {
      console.warn('Cannot submit proposal: missing user, project or supabase', { currentUser, projectToApply });
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // 1. Save Proposal to Supabase (let DB generate the UUID)
    const { data: propData, error: propError } = await supabase.from('proposals').insert([{
      project_id: projectToApply.id,
      freelancer_id: currentUser.id,
      freelancer_name: `${currentUser.name} ${currentUser.lastname}`,
      cover_letter: formData.get('coverLetter') as string,
      price: formData.get('price') as string,
      time: formData.get('time') as string,
      portfolio: formData.get('portfolio') as string,
      status: 'pending'
    }]).select().single();

    if (propError) {
      console.error('Error saving proposal:', propError);
      showToast('Error al enviar la propuesta', 'error');
      return;
    }

    // Update local state with the returned data (includes DB-generated ID and created_at)
    const savedProposal: Proposal = {
      id: propData.id,
      projectId: propData.project_id,
      freelancerId: propData.freelancer_id,
      freelancerName: propData.freelancer_name,
      coverLetter: propData.cover_letter,
      price: propData.price,
      time: propData.time,
      portfolio: propData.portfolio,
      status: propData.status,
      createdAt: propData.created_at
    };

    setProposals(prev => [...prev, savedProposal]);
    showToast('¡Propuesta enviada con éxito!');

    // 2. Handle Messaging
    const creatorId = projectToApply.creatorId || 'admin';
    const creatorName = projectToApply.creatorName || 'Creador del Proyecto';
    const proposalText = `¡Nueva Aplicación!\nProyecto: ${projectToApply.title}\nPrecio Propuesto: $${savedProposal.price}\nTiempo estimado: ${savedProposal.time}\n\nCarta de presentación:\n${savedProposal.coverLetter}\n\nPortafolio: ${savedProposal.portfolio || 'No especificado'}`;

    // Check if conversation exists
    const existingConv = conversations.find(c => c.participants.includes(currentUser.id) && c.participants.includes(creatorId));

    if (existingConv) {
      // Create message for existing conversation
      const { data: msgData, error: msgError } = await supabase.from('messages').insert([{
        conversation_id: existingConv.id,
        sender_id: currentUser.id,
        text: proposalText
      }]).select().single();

      if (!msgError && msgData) {
        const newMsg: Message = {
          id: msgData.id,
          senderId: msgData.sender_id,
          text: msgData.text,
          timestamp: msgData.timestamp
        };

        // Update conversation metadata
        await supabase.from('conversations').update({
          last_message: newMsg.text,
          last_message_time: newMsg.timestamp,
          unread_count: (existingConv.unreadCount || 0) + 1
        }).eq('id', existingConv.id);

        setConversations(prev => prev.map(c => c.id === existingConv.id ? {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: newMsg.text,
          lastMessageTime: newMsg.timestamp,
          unreadCount: (c.unreadCount || 0) + 1
        } : c));

        setActiveConversationId(existingConv.id);
      }
    } else {
      // Create NEW conversation first
      const { data: newConvData, error: convError } = await supabase.from('conversations').insert([{
        participants: [currentUser.id, creatorId],
        participant_names: { [currentUser.id]: `${currentUser.name} ${currentUser.lastname}`, [creatorId]: creatorName },
        last_message: proposalText,
        unread_count: 1
      }]).select().single();

      if (!convError && newConvData) {
        // Now create the first message
        const { data: msgData, error: msgError } = await supabase.from('messages').insert([{
          conversation_id: newConvData.id,
          sender_id: currentUser.id,
          text: proposalText
        }]).select().single();

        if (!msgError && msgData) {
          const newMsg: Message = {
            id: msgData.id,
            senderId: msgData.sender_id,
            text: msgData.text,
            timestamp: msgData.timestamp
          };

          const newConv: Conversation = {
            id: newConvData.id,
            participants: newConvData.participants,
            participantNames: newConvData.participant_names,
            messages: [newMsg],
            unreadCount: 1,
            lastMessage: newMsg.text,
            lastMessageTime: newMsg.timestamp
          };

          setConversations(prev => [...prev, newConv]);
          setActiveConversationId(newConv.id);
        }
      }
    }

    setActiveSection('inbox');
  };

  const updateProposalStatus = async (propId: string, status: 'accepted' | 'rejected') => {
    const proposal = proposals.find(p => p.id === propId);
    if (!proposal) return;

    if (supabase) {
      try {
        await supabase.from('proposals').update({ status }).eq('id', propId);
        if (status === 'accepted') {
          await supabase.from('projects').update({ status: 'in-progress' }).eq('id', proposal.projectId);
        }
      } catch (err) {
        console.error('Error updating status:', err);
      }
    }

    setProposals(proposals.map(p => p.id === propId ? { ...p, status } : p));

    if (status === 'accepted') {
      // Update project status to 'in-progress'
      setProjects(projects.map(p => p.id === proposal.projectId ? { ...p, status: 'in-progress' } : p));
      showToast('Propuesta aceptada. El proyecto está ahora en progreso.');
    } else {
      showToast('Propuesta rechazada');
    }
  };

  const markProjectCompleted = async (projectId: string) => {
    if (supabase) {
      await supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);
    }
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const { data, error } = await supabase.from('announcements').insert([{
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        active: true
      }]).select().single();

      if (error) throw error;

      if (data) {
        const newAnnouncement: Announcement = {
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: data.created_at,
          active: data.active
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setActiveModal(null);
        showToast('Anuncio publicado');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      showToast('Error al publicar anuncio', 'error');
    }
  };

  const handleToggleAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const previousType = currentUser?.type;
    const typeChanged = previousType && previousType !== updatedUser.type;

    if (supabase) {
      await supabase.from('users').update({
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        type: updatedUser.type,
        channel: updatedUser.channel,
        specialty: updatedUser.specialty,
        skills: updatedUser.skills,
        avatar: updatedUser.avatar,
        description: updatedUser.description,
        social_links: updatedUser.socialLinks,
        portfolio: updatedUser.portfolio,
        categories: updatedUser.categories
      }).eq('id', updatedUser.id);
    }

    // Update local state
    setCurrentUser(updatedUser);

    // Update users list
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);

    if (typeChanged) {
      const newDashboard = updatedUser.type === 'creator' ? 'dashboard-creator' : 'dashboard-freelancer';
      showToast(`Rol cambiado a ${updatedUser.type === 'creator' ? 'Creador' : 'Freelancer'} ✓`, 'success');
      setActiveSection(newDashboard);
    } else {
      showToast('Perfil actualizado con éxito');
    }
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
  const sendMessage = async () => {
    if (!newMessageText.trim() || !activeConversationId || !currentUser || !supabase) return;

    try {
      const { data: msgData, error: msgError } = await supabase.from('messages').insert([{
        conversation_id: activeConversationId,
        sender_id: currentUser.id,
        text: newMessageText
      }]).select().single();

      if (msgError) throw msgError;

      if (msgData) {
        const newMsg: Message = {
          id: msgData.id,
          senderId: msgData.sender_id,
          text: msgData.text,
          timestamp: msgData.timestamp
        };

        // Update conversation metadata
        await supabase.from('conversations')
          .update({ last_message: newMsg.text, last_message_time: newMsg.timestamp })
          .eq('id', activeConversationId);

        setConversations(prev => prev.map(c => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.timestamp,
              unreadCount: 0
            };
          }
          return c;
        }));
        setNewMessageText('');
      }
    } catch (err) {
      console.error('Error sending message DB:', err);
      showToast('Error al enviar mensaje', 'error');
    }
  };

  const startConversation = async (targetUserId: string, targetUserName: string) => {
    if (!currentUser || !supabase) {
      if (!currentUser) setActiveModal('login');
      return;
    }

    // Check if conversation exists
    const existingConv = conversations.find(c =>
      c.participants.includes(currentUser.id) && c.participants.includes(targetUserId)
    );

    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveSection('inbox');
    } else {
      try {
        const { data, error } = await supabase.from('conversations').insert([{
          participants: [currentUser.id, targetUserId],
          participant_names: {
            [currentUser.id]: `${currentUser.name} ${currentUser.lastname}`,
            [targetUserId]: targetUserName
          },
          unread_count: 0,
          last_message: '',
          last_message_time: new Date().toISOString()
        }]).select().single();

        if (error) throw error;

        if (data) {
          const newConv: Conversation = {
            id: data.id,
            participants: data.participants,
            participantNames: data.participant_names,
            messages: [],
            unreadCount: 0,
            lastMessage: data.last_message,
            lastMessageTime: data.last_message_time
          };

          setConversations(prev => [...prev, newConv]);
          setActiveConversationId(newConv.id);
          setActiveSection('inbox');
        }
      } catch (err) {
        console.error('Error creating conversation DB:', err);
        showToast('Error al iniciar conversación', 'error');
      }
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

  // Validar si el usuario intenta acceder a una ruta protegida sin sesión
  const publicSections = ['landing', 'explore', 'how-it-works', 'blog'];
  const isProtectedSection = !publicSections.includes(activeSection);
  const showProtectedWarning = isProtectedSection && !currentUser;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-gray-100 font-sans selection:bg-indigo-500/30">
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

      <main className="pt-24 pb-12 px-4 relative z-10 transition-all duration-300">

        {/* Lógica de Bloqueo a Usuarios No Autentificados */}
        {showProtectedWarning ? (
          <div className="max-w-3xl mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-12">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Acceso Restringido</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Debes iniciar sesión con tu cuenta para acceder a tu Panel, Mensajes, Perfil y más herramientas exclusivas de CreatorFound.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setActiveModal('login')} className="btn-primary px-8 py-3 rounded-full text-white font-bold transition-all shadow-lg shadow-indigo-500/20">
                  Iniciar Sesión
                </button>
                <button onClick={() => setActiveSection('landing')} className="px-8 py-3 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                              <span className="text-xs text-gray-500">{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

            {/* CREATE PROJECT FORM */}
            {activeSection === 'create-project' && (
              <CreateProjectForm
                currentUser={currentUser}
                onBack={() => setActiveSection('dashboard-creator')}
                showToast={showToast}
                onProjectCreated={handleCreateProject}
              />
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
                onApply={(project) => {
                  setProjectToApply(project);
                  setActiveSection('apply-proposal');
                }}
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
                onNewProject={() => setActiveSection('create-project')}
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
                onBack={previousSection ? () => setActiveSection(previousSection) : undefined}
              />
            )}

            {/* HOW IT WORKS */}
            {activeSection === 'how-it-works' && <HowItWorks />}

            {/* BLOG */}
            {activeSection === 'blog' && <Blog blogPosts={blogPosts} />}

            {/* APPLY PROPOSAL SECTION */}
            {activeSection === 'apply-proposal' && projectToApply && (
              <ApplyProposal
                project={projectToApply}
                currentUser={currentUser}
                onBack={() => {
                  setViewingProject(projectToApply);
                  setActiveSection('explore');
                }}
                onSubmit={handleSubmitProposal}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveSection} />

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
                  <div className="space-y-4 mt-6">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                      Continuar con Google
                    </button>

                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-xs text-gray-500 uppercase font-bold">o con email</span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                        <input type="email" name="email" required className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" placeholder="ejemplo@correo.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Contraseña</label>
                        <input type="password" name="password" required className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" placeholder="Tu contraseña segura" />
                      </div>
                      <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-2">Iniciar Sesión</button>
                    </form>
                  </div>
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
                    <input type="password" name="password" required placeholder="Contraseña segura" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <input type="text" name="channel" placeholder="Nombre del Canal (Opcional)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-6">Registrarse</button>
                  </form>
                </>
              )}

              {/* Create Announcement Modal */}
              {activeModal === 'createAnnouncement' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Nuevo Anuncio</h2>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Título del Anuncio</label>
                      <input name="title" required className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" placeholder="Ej. Mantenimiento programado" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Contenido</label>
                      <textarea name="content" required rows={4} className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none" placeholder="Detalles del anuncio..."></textarea>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-white mt-6">Publicar Anuncio</button>
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
                    <input type="url" name="portfolio" placeholder="Link de Portafolio (Opcional)" className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" />
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
        )
        }
      </AnimatePresence >

      {/* --- Toast --- */}
      <AnimatePresence>
        {
          toast && (
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className={`fixed bottom-4 right-4 z-50 glass-card p-4 rounded-xl border-l-4 ${toast.type === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'} flex items-center gap-3 shadow-lg`}
            >
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium text-sm text-white">{toast.msg}</span>
            </motion.div>
          )
        }
      </AnimatePresence >

      <AIAssistant currentUser={currentUser} projects={projects} />

    </div >
  );
}
