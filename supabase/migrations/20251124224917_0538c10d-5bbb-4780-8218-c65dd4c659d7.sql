-- Create table for caching PubMed papers
CREATE TABLE IF NOT EXISTS public.pubmed_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient_name TEXT NOT NULL,
  papers_json JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pubmed_cache_ingredient ON public.pubmed_cache(ingredient_name);

-- Create index to handle cache expiration queries efficiently
CREATE INDEX IF NOT EXISTS idx_pubmed_cache_fetched_at ON public.pubmed_cache(fetched_at);

-- Enable RLS
ALTER TABLE public.pubmed_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cached papers (public data)
CREATE POLICY "Anyone can read PubMed cache"
ON public.pubmed_cache
FOR SELECT
USING (true);

-- Only service role can insert/update cache
CREATE POLICY "Service role can manage cache"
ON public.pubmed_cache
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');