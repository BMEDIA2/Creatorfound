import { User, Project, Proposal } from './types';

export const DEMO_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Juan', 
    lastname: 'Creator', 
    email: 'creator@demo.com', 
    type: 'creator', 
    channel: '@JuanGaming', 
    status: 'active',
    reputation: { score: 95, level: 'Top Rated', completedJobs: 12 }
  },
  { 
    id: 'u2', 
    name: 'Alex', 
    lastname: 'Editor', 
    email: 'freelancer@demo.com', 
    type: 'freelancer', 
    specialty: 'editing', 
    skills: ['Premiere', 'After Effects'], 
    status: 'active',
    reputation: { score: 88, level: 'Rising Talent', completedJobs: 5 }
  },
  { id: 'admin1', name: 'Admin', lastname: 'System', email: 'admin@demo.com', type: 'admin', status: 'active' }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Editor de Video Gaming Estilo MrBeast',
    category: 'editing',
    budget: '$800-1200',
    description: 'Busco un editor capaz de mantener una retención alta. Edición dinámica, subtítulos, efectos de sonido y memes.',
    skills: 'Premiere Pro, After Effects',
    duration: 'full-time',
    experience: 'senior',
    creatorId: 'u1',
    creatorName: '@JuanGaming',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'p2',
    title: 'Diseñador de Miniaturas Clickbait',
    category: 'thumbnail',
    budget: '$50/img',
    description: 'Necesito 3 miniaturas a la semana. Estilo brillante, caras expresivas y buen uso de contraste.',
    skills: 'Photoshop, Blender',
    duration: 'part-time',
    experience: 'mid',
    creatorId: 'u1',
    creatorName: '@JuanGaming',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active'
  },
  {
    id: 'p3',
    title: 'Guionista para Canal de Tech',
    category: 'script',
    budget: '$200/guion',
    description: 'Investigación profunda sobre IA y tecnología. Guiones de 1500 palabras.',
    skills: 'Redacción, Storytelling',
    duration: 'one-time',
    experience: 'expert',
    creatorId: 'u3',
    creatorName: '@TechDaily',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'active'
  }
];

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 'prop1',
    projectId: 'p1',
    freelancerId: 'u2',
    freelancerName: 'Alex Editor',
    coverLetter: 'Hola, tengo 3 años de experiencia editando gaming. He trabajado con canales de 100k subs.',
    price: '$900',
    time: '1w',
    portfolio: 'https://behance.net/alex',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];
