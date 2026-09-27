-- Create the reporter_applications table
CREATE TABLE IF NOT EXISTS public.reporter_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    aadhar_card TEXT NOT NULL,
    press_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.reporter_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since they apply from login page before logging in)
CREATE POLICY "Allow public inserts to reporter_applications"
ON public.reporter_applications FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to view their own application based on email (optional)
CREATE POLICY "Allow users to view own application"
ON public.reporter_applications FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Allow admins to do everything
CREATE POLICY "Allow admins full access to reporter_applications"
ON public.reporter_applications FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
