import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: 3 requests per second max for PubMed
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface PubMedPaper {
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid: string;
  summary: string;
  verified: boolean;
  studyType?: string;
  sampleSize?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredientName, maxResults = 3 } = await req.json();
    
    if (!ingredientName) {
      throw new Error("ingredientName parameter is required");
    }

    console.log(`Fetching PubMed papers for: ${ingredientName}`);

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    let supabase;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Check cache first (30-day expiration)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: cachedData } = await supabase
        .from('pubmed_cache')
        .select('papers_json, fetched_at')
        .eq('ingredient_name', ingredientName.toLowerCase())
        .gt('fetched_at', thirtyDaysAgo.toISOString())
        .single();
      
      if (cachedData) {
        console.log(`Cache hit for ${ingredientName}`);
        return new Response(
          JSON.stringify({ papers: cachedData.papers_json, fromCache: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Step 1: Search PubMed for relevant papers
    const searchQuery = encodeURIComponent(`${ingredientName} clinical trial OR randomized controlled trial OR systematic review OR meta-analysis`);
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchQuery}&retmax=${maxResults * 2}&retmode=json&sort=relevance`;
    
    console.log(`Searching PubMed: ${searchUrl}`);
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`PubMed search failed: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    const pmids = searchData.esearchresult?.idlist || [];
    
    if (pmids.length === 0) {
      console.log(`No papers found for ${ingredientName}`);
      return new Response(
        JSON.stringify({ papers: [], fromCache: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${pmids.length} PMIDs: ${pmids.join(', ')}`);

    // Rate limiting: wait 350ms between requests (3 requests per second)
    await sleep(350);

    // Step 2: Fetch details for each paper
    const pmidList = pmids.slice(0, maxResults).join(',');
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmidList}&retmode=xml`;
    
    console.log(`Fetching paper details for PMIDs: ${pmidList}`);
    const fetchResponse = await fetch(fetchUrl);
    
    if (!fetchResponse.ok) {
      throw new Error(`PubMed fetch failed: ${fetchResponse.status}`);
    }
    
    const xmlText = await fetchResponse.text();
    
    // Parse XML to extract paper details
    const papers: PubMedPaper[] = [];
    const articlePattern = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
    const articles = xmlText.match(articlePattern) || [];
    
    for (const article of articles.slice(0, maxResults)) {
      try {
        // Extract PMID
        const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
        const pmid = pmidMatch ? pmidMatch[1] : '';
        
        // Extract title
        const titleMatch = article.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'No title available';
        
        // Extract authors
        const authorMatches = article.match(/<LastName>(.*?)<\/LastName>/g);
        const firstAuthor = authorMatches && authorMatches[0] 
          ? authorMatches[0].replace(/<\/?LastName>/g, '') 
          : 'Unknown';
        const authors = authorMatches && authorMatches.length > 1 
          ? `${firstAuthor} et al.` 
          : firstAuthor;
        
        // Extract journal
        const journalMatch = article.match(/<Title>(.*?)<\/Title>/);
        const journal = journalMatch ? journalMatch[1] : 'Unknown Journal';
        
        // Extract year
        const yearMatch = article.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/);
        const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
        
        // Extract abstract for summary
        const abstractMatch = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
        let summary = 'No abstract available';
        if (abstractMatch) {
          const abstractText = abstractMatch[1].replace(/<[^>]+>/g, '').trim();
          // Take first 200 characters as summary
          summary = abstractText.length > 200 
            ? abstractText.substring(0, 197) + '...' 
            : abstractText;
        }
        
        // Determine study type for evidence level calculation
        const articleLower = article.toLowerCase();
        let studyType = 'observational';
        if (articleLower.includes('randomized controlled trial') || articleLower.includes('rct')) {
          studyType = 'rct';
        } else if (articleLower.includes('meta-analysis')) {
          studyType = 'meta-analysis';
        } else if (articleLower.includes('systematic review')) {
          studyType = 'systematic-review';
        }
        
        papers.push({
          title,
          authors,
          journal,
          year,
          pmid,
          summary,
          verified: true,
          studyType
        });
      } catch (parseError) {
        console.error('Error parsing article:', parseError);
      }
    }

    console.log(`Successfully parsed ${papers.length} papers`);

    // Cache the results
    if (supabase && papers.length > 0) {
      const { error: cacheError } = await supabase
        .from('pubmed_cache')
        .insert({
          ingredient_name: ingredientName.toLowerCase(),
          papers_json: papers
        });
      
      if (cacheError) {
        console.error('Cache insert error:', cacheError);
      } else {
        console.log(`Cached papers for ${ingredientName}`);
      }
    }

    return new Response(
      JSON.stringify({ papers, fromCache: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-pubmed-papers:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        papers: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
