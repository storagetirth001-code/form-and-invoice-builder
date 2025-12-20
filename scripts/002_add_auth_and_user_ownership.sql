-- Update forms table to add user ownership
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Drop old policies
DROP POLICY IF EXISTS "Allow public read access to forms" ON public.forms;
DROP POLICY IF EXISTS "Allow public insert to forms" ON public.forms;
DROP POLICY IF EXISTS "Allow public update to forms" ON public.forms;

-- Only allow users to see published forms OR their own forms
CREATE POLICY "Users can view published forms or own forms"
  ON public.forms
  FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

-- Users can create their own forms
CREATE POLICY "Users can create own forms"
  ON public.forms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own forms
CREATE POLICY "Users can update own forms"
  ON public.forms
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own forms
CREATE POLICY "Users can delete own forms"
  ON public.forms
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update form_submissions policies
DROP POLICY IF EXISTS "Allow public read access to form_submissions" ON public.form_submissions;

-- Form owners can see submissions to their forms
CREATE POLICY "Form owners can view submissions"
  ON public.form_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = form_submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Anyone can submit to published forms
CREATE POLICY "Anyone can submit to published forms"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = form_submissions.form_id 
      AND forms.is_published = true
    )
  );

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON public.forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_is_published ON public.forms(is_published);
