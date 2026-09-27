-- Create comments table for clippings
CREATE TABLE IF NOT EXISTS public.lipping_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clipping_id UUID NOT NULL REFERENCES public.clippings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL DEFAULT 'Anonymous',
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lipping_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Allow public read on lipping_comments"
ON public.lipping_comments FOR SELECT
TO public
USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Allow authenticated insert on lipping_comments"
ON public.lipping_comments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Index for fast lookups by clipping
CREATE INDEX IF NOT EXISTS lipping_comments_clipping_id_idx ON public.lipping_comments(clipping_id);
