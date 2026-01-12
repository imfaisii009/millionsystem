-- Create IQ Questions Table
CREATE TABLE IF NOT EXISTS public.iq_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.iq_questions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access" ON public.iq_questions
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service role insert" ON public.iq_questions
    FOR INSERT TO service_role WITH CHECK (true);

-- Create RPC function for random selection
CREATE OR REPLACE FUNCTION get_random_iq_question()
RETURNS SETOF public.iq_questions
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.iq_questions
  ORDER BY random()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
