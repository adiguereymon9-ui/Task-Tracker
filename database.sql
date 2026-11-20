CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- PROFILES
-- =========================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active TIMESTAMPTZ
);

-- =========================================
-- TASKS
-- =========================================

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL
        CHECK (length(title) <= 150),

    description TEXT,

    priority TEXT NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),

    category TEXT DEFAULT 'personal',

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed')),

    due_date DATE,
    due_time TIME,

    repeat_type TEXT DEFAULT 'once',

    alarm_enabled BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMPTZ
);

-- =========================================
-- ACTIVITY LOGS
-- =========================================

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES auth.users(id)
        ON DELETE SET NULL,

    action TEXT NOT NULL,

    details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- ANNOUNCEMENTS
-- =========================================

CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- NOTIFICATIONS
-- =========================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES auth.users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,
    message TEXT NOT NULL,

    read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX tasks_user_id_idx
ON public.tasks(user_id);

CREATE INDEX tasks_status_idx
ON public.tasks(status);

CREATE INDEX profiles_status_idx
ON public.profiles(status);

CREATE INDEX profiles_created_at_idx
ON public.profiles(created_at);

CREATE INDEX notifications_user_id_idx
ON public.notifications(user_id);


-- =========================================
-- =========================================
-- =========================================


CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND role = 'admin'
          AND status = 'active'
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_admin()
TO authenticated;


-- =========================================
-- =========================================
-- =========================================


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


-- =========================================
-- =========================================
-- =========================================


CREATE POLICY "Profile access"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);


-- =========================================
-- =========================================
-- =========================================


CREATE POLICY "Task read access"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Task create access"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid())
);

CREATE POLICY "Task update access"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
)
WITH CHECK (
    user_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Task delete access"
ON public.tasks
FOR DELETE
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);


-- =========================================
-- =========================================
-- =========================================


CREATE POLICY "Users read own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Users update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
    user_id = (SELECT auth.uid())
)
WITH CHECK (
    user_id = (SELECT auth.uid())
);


