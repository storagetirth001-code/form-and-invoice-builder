-- Create forms table to store form schemas
CREATE TABLE IF NOT EXISTS public.forms (
  id TEXT PRIMARY KEY,
  schema JSONB NOT NULL,
  google_sheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table to store form responses
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id TEXT NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to forms (so anyone can view the form)
CREATE POLICY "Allow public read access to forms"
  ON public.forms
  FOR SELECT
  USING (true);

-- Allow public insert/update for forms (anyone can create or update forms)
CREATE POLICY "Allow public insert to forms"
  ON public.forms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to forms"
  ON public.forms
  FOR UPDATE
  USING (true);

-- Allow public insert to form_submissions (anyone can submit a form)
CREATE POLICY "Allow public insert to form_submissions"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow public read access to form_submissions (so form owners can see submissions)
CREATE POLICY "Allow public read access to form_submissions"
  ON public.form_submissions
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON public.form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_forms_id ON public.forms(id);
