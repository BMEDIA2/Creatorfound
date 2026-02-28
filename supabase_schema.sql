-- 1. Tabla: waitlist (Ya la hicimos antes, pero por si acaso no está)
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT auth.uid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla: users
-- Extiende la tabla por defecto de auth.users o funciona de forma autónoma
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('creator', 'freelancer', 'admin')) NOT NULL,
    channel TEXT,
    specialty TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    description TEXT,
    avatar TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    portfolio JSONB DEFAULT '[]'::jsonb,
    clients JSONB DEFAULT '[]'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb,
    categories JSONB DEFAULT '[]'::jsonb,
    reputation JSONB DEFAULT '{"score": 0, "level": "New", "completedJobs": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    budget TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT NOT NULL,
    duration TEXT,
    experience TEXT,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in-progress', 'completed', 'closed')),
    image TEXT,
    example_links JSONB DEFAULT '[]'::jsonb,
    experience_time TEXT,
    project_duration TEXT CHECK (project_duration IN ('short', 'medium', 'long') OR project_duration IS NULL),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla: proposals
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    freelancer_name TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    price TEXT NOT NULL,
    time TEXT NOT NULL,
    portfolio TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla: conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participants JSONB NOT NULL, -- Array de UUIDs
    participant_names JSONB NOT NULL, -- Mapa de ID -> Nombre
    unread_count INTEGER DEFAULT 0,
    last_message TEXT,
    last_message_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla: announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabla: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT,
    author_avatar TEXT,
    date TEXT NOT NULL,
    read_time TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabla: saved_projects
CREATE TABLE IF NOT EXISTS public.saved_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, project_id)
);

-- ==========================================
-- Configuración de Seguridad (RLS - Row Level Security)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo rápido (Lectura para todos, escritura para logueados)
-- IMPORTANTE: En producción de verdad, estas políticas se endurecerían.

-- Users: Todos pueden ver, logueados pueden insertar/editar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Public profiles are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile.'
    ) THEN
        CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile.'
    ) THEN
        CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;


-- Projects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects viewable by everyone.'
    ) THEN
        CREATE POLICY "Projects viewable by everyone." ON public.projects FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Authenticated users can create projects.'
    ) THEN
        CREATE POLICY "Authenticated users can create projects." ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Creators can update their projects.'
    ) THEN
        CREATE POLICY "Creators can update their projects." ON public.projects FOR UPDATE USING (auth.uid() = creator_id);
    END IF;
END $$;


-- Proposals 
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'proposals' AND policyname = 'Proposals viewable by authenticated.'
    ) THEN
        CREATE POLICY "Proposals viewable by authenticated." ON public.proposals FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'proposals' AND policyname = 'Authenticated users can create proposals.'
    ) THEN
        CREATE POLICY "Authenticated users can create proposals." ON public.proposals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;


-- Waitlist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'waitlist' AND policyname = 'Anyone can insert into waitlist'
    ) THEN
        CREATE POLICY "Anyone can insert into waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Conversations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can view their own conversations.'
    ) THEN
        CREATE POLICY "Users can view their own conversations." ON public.conversations 
        FOR SELECT USING (participants @> jsonb_build_array(auth.uid()::text));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can create conversations they are part of.'
    ) THEN
        CREATE POLICY "Users can create conversations they are part of." ON public.conversations 
        FOR INSERT WITH CHECK (participants @> jsonb_build_array(auth.uid()::text));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can update their own conversations.'
    ) THEN
        CREATE POLICY "Users can update their own conversations." ON public.conversations 
        FOR UPDATE USING (participants @> jsonb_build_array(auth.uid()::text));
    END IF;
END $$;

-- Messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can view messages in their conversations.'
    ) THEN
        CREATE POLICY "Users can view messages in their conversations." ON public.messages 
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.conversations c 
                WHERE c.id = messages.conversation_id 
                AND c.participants @> jsonb_build_array(auth.uid()::text)
            )
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can insert messages to their conversations.'
    ) THEN
        CREATE POLICY "Users can insert messages to their conversations." ON public.messages 
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.conversations c 
                WHERE c.id = conversation_id 
                AND c.participants @> jsonb_build_array(auth.uid()::text)
            )
        );
    END IF;
END $$;

-- Announcements
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Announcements viewable by everyone.'
    ) THEN
        CREATE POLICY "Announcements viewable by everyone." ON public.announcements FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Authenticated users can manage announcements.'
    ) THEN
        CREATE POLICY "Authenticated users can manage announcements." ON public.announcements FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Blog Posts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Blog posts viewable by everyone.'
    ) THEN
        CREATE POLICY "Blog posts viewable by everyone." ON public.blog_posts FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authenticated users can manage blog posts.'
    ) THEN
        CREATE POLICY "Authenticated users can manage blog posts." ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Saved Projects
ALTER TABLE public.saved_projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'saved_projects' AND policyname = 'Users can view their own saved projects.'
    ) THEN
        CREATE POLICY "Users can view their own saved projects." ON public.saved_projects 
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'saved_projects' AND policyname = 'Users can save projects for themselves.'
    ) THEN
        CREATE POLICY "Users can save projects for themselves." ON public.saved_projects 
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'saved_projects' AND policyname = 'Users can unsave their projects.'
    ) THEN
        CREATE POLICY "Users can unsave their projects." ON public.saved_projects 
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
