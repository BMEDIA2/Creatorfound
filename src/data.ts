import { User, Project, Proposal } from './types';

export const DEMO_USERS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Juan',
    lastname: 'Creator',
    email: 'creator@demo.com',
    type: 'creator',
    channel: '@JuanGaming',
    status: 'active',
    reputation: { score: 95, level: 'Top Rated', completedJobs: 12 }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Alex',
    lastname: 'Editor',
    email: 'freelancer@demo.com',
    type: 'freelancer',
    specialty: 'editing',
    skills: ['Premiere', 'After Effects'],
    status: 'active',
    reputation: { score: 88, level: 'Rising Talent', completedJobs: 5 }
  },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Admin', lastname: 'System', email: 'admin@demo.com', type: 'admin', status: 'active' }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Editor de Video Gaming Estilo MrBeast',
    category: 'editing',
    budget: '$800-1200',
    description: 'Busco un editor capaz de mantener una retención alta. Edición dinámica, subtítulos, efectos de sonido y memes.',
    skills: 'Premiere Pro, After Effects',
    duration: 'full-time',
    experience: 'senior',
    creatorId: '11111111-1111-1111-1111-111111111111',
    creatorName: '@JuanGaming',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Diseñador de Miniaturas Clickbait',
    category: 'thumbnail',
    budget: '$50/img',
    description: 'Necesito 3 miniaturas a la semana. Estilo brillante, caras expresivas y buen uso de contraste.',
    skills: 'Photoshop, Blender',
    duration: 'part-time',
    experience: 'mid',
    creatorId: '11111111-1111-1111-1111-111111111111',
    creatorName: '@JuanGaming',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    title: 'Guionista para Canal de Tech',
    category: 'script',
    budget: '$200/guion',
    description: 'Investigación profunda sobre IA y tecnología. Guiones de 1500 palabras.',
    skills: 'Redacción, Storytelling',
    duration: 'one-time',
    experience: 'expert',
    creatorId: '33333333-3333-3333-3333-333333333333',
    creatorName: '@TechDaily',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'active'
  }
];

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    projectId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    freelancerId: '22222222-2222-2222-2222-222222222222',
    freelancerName: 'Alex Editor',
    coverLetter: 'Hola, tengo 3 años de experiencia editando gaming. He trabajado con canales de 100k subs.',
    price: '$900',
    time: '1w',
    portfolio: 'https://behance.net/alex',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];
