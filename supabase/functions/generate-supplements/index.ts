import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function searchPubMed(ingredient: string, healthGoal: string): Promise<any[]> {
  try {
    // Search PubMed for papers
    const searchTerm = encodeURIComponent(`${ingredient} ${healthGoal} clinical trial OR randomized controlled trial OR systematic review`);
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchTerm}&retmax=15&retmode=json&sort=relevance`;
    
    console.log(`Searching PubMed for: ${ingredient} + ${healthGoal}`);
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    if (pmids.length === 0) return [];
    
    // Fetch paper details
    await new Promise(resolve => setTimeout(resolve, 350)); // Rate limit: 3 req/sec
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
    const fetchResponse = await fetch(fetchUrl);
    const xmlText = await fetchResponse.text();
    
    // Parse XML to extract papers
    return parseXMLToPapers(xmlText);
  } catch (error) {
    console.error('PubMed API error:', error);
    return [];
  }
}

function parseXMLToPapers(xml: string): any[] {
  const papers: any[] = [];
  
  // Extract PMIDs
  const pmidMatches = xml.matchAll(/<PMID[^>]*>(\d+)<\/PMID>/g);
  const pmids = [...pmidMatches].map(m => m[1]);
  
  // Extract titles
  const titleMatches = xml.matchAll(/<ArticleTitle>([^<]+)<\/ArticleTitle>/g);
  const titles = [...titleMatches].map(m => m[1]);
  
  // Extract journals
  const journalMatches = xml.matchAll(/<Title>([^<]+)<\/Title>/g);
  const journals = [...journalMatches].map(m => m[1]);
  
  // Extract years
  const yearMatches = xml.matchAll(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/g);
  const years = [...yearMatches].map(m => m[1]);
  
  // Extract first author
  const authorMatches = xml.matchAll(/<Author[^>]*>[\s\S]*?<LastName>([^<]+)<\/LastName>/g);
  const authors = [...authorMatches].map(m => `${m[1]} et al.`);
  
  // Extract abstracts
  const abstractMatches = xml.matchAll(/<AbstractText[^>]*>([^<]+)<\/AbstractText>/g);
  const abstracts = [...abstractMatches].map(m => m[1]);
  
  // Combine into paper objects
  for (let i = 0; i < Math.min(pmids.length, titles.length); i++) {
    if (titles[i] && pmids[i]) {
      papers.push({
        pmid: pmids[i],
        title: titles[i],
        journal: journals[i] || 'Unknown Journal',
        year: parseInt(years[i]) || new Date().getFullYear(),
        authors: authors[i] || 'Unknown Authors',
        abstract: abstracts[i] || ''
      });
    }
  }
  
  return papers;
}

async function filterPapersWithAI(papers: any[], ingredient: string, healthGoal: string, apiKey: string): Promise<any[]> {
  if (papers.length === 0) return [];
  
  const papersText = papers.map((p, idx) => 
    `${idx + 1}. Title: "${p.title}"
    Year: ${p.year}
    Journal: ${p.journal}
    PMID: ${p.pmid}
    Abstract: ${p.abstract.substring(0, 300)}...`
  ).join('\n\n');
  
  const filterPrompt = `You are a scientific research evaluator. I have ${papers.length} real papers from PubMed about "${ingredient}" for "${healthGoal}".

Select the 3 MOST RELEVANT and HIGHEST QUALITY papers based on:
1. Direct relevance to ${ingredient} AND ${healthGoal}
2. Study quality (prefer RCTs, meta-analyses, systematic reviews over observational studies)
3. Recency (prefer papers from last 5 years)
4. Clear, measurable outcomes

Papers:
${papersText}

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "title": "exact paper title from above",
    "authors": "authors from above",
    "journal": "journal from above", 
    "year": year_number,
    "pmid": "pmid from above",
    "summary": "1-2 sentence plain-English summary of the KEY FINDING (avoid jargon, explain what it means for users)",
    "studyType": "rct" or "meta-analysis" or "systematic-review" or "observational" or "case-study"
  }
]

Select exactly 3 papers. Use only the data provided above.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: filterPrompt }],
        temperature: 0.3,
      }),
    });
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const filtered = JSON.parse(cleanContent);
    
    return filtered.slice(0, 3).map((p: any) => ({
      ...p,
      verified: true
    }));
  } catch (error) {
    console.error('AI filtering error:', error);
    // Fallback: return first 3 with basic summaries
    return papers.slice(0, 3).map(p => ({
      title: p.title,
      authors: p.authors,
      journal: p.journal,
      year: p.year,
      pmid: p.pmid,
      summary: p.abstract?.substring(0, 150) || 'Research on ' + ingredient,
      studyType: 'observational',
      verified: true
    }));
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, answers = {} } = await req.json();
    
    // Get user profile if authenticated
    const authHeader = req.headers.get('Authorization');
    let userProfile = null;
    
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } }
        });
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          userProfile = profile;
          console.log("User profile loaded:", userProfile ? "Yes" : "No");
        }
      }
    }
    
    if (!query) {
      throw new Error("Query parameter is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating supplements for query:", query);

    let profileContext = "";
    if (userProfile) {
      const geneticInfo = userProfile.genetic_data_snps 
        ? Object.entries(userProfile.genetic_data_snps)
            .filter(([_, value]) => value)
            .map(([key]) => key.toUpperCase())
            .join(", ")
        : "";
      
      profileContext = `\n\nUser Profile Context:
- Age: ${userProfile.age || "Not specified"}
- Sex: ${userProfile.sex || "Not specified"}
- Activity Level: ${userProfile.activity_level || "Not specified"}
- Dietary Preferences: ${Array.isArray(userProfile.dietary_preferences) ? userProfile.dietary_preferences.join(", ") : "None"}
- Dietary Restrictions: ${Array.isArray(userProfile.dietary_restrictions) ? userProfile.dietary_restrictions.join(", ") : "None"}
- Allergies: ${Array.isArray(userProfile.allergies) ? userProfile.allergies.join(", ") : "None"}
${geneticInfo ? `- Genetic Variants: ${geneticInfo}` : ""}

Consider this profile when making recommendations. Adjust dosages based on age/sex, avoid ingredients incompatible with dietary restrictions, and provide genetic-specific advice if relevant SNPs are present.`;
    }

    let answersContext = "";
    if (Object.keys(answers).length > 0) {
      answersContext = `\n\nQuestionnaire Answers:
${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

Use these answers to further personalize recommendations and dosages.`;
    }

    const systemPrompt = `You are a supplement recommendation AI that analyzes health goals and recommends evidence-based supplements.

For each health goal, provide exactly 3 supplement recommendations in JSON format. Each recommendation should include:
- name: Product name
- description: Brief product description (max 100 chars)
- socialSentiment: Score from 60-95 representing user satisfaction percentage
- evidenceLevel: "A" (strong clinical evidence), "B" (moderate evidence), "C" (limited evidence), or "D" (insufficient)
- keyBenefits: Array of 3-4 specific benefits with percentages/timeframes (personalize if profile data available)
- warnings: Array of 2-3 important safety warnings or contraindications (include profile-specific warnings)
- ingredients: Array of 3-5 key active ingredients with dosages
- price: Price range like "$24.99" or "$28-32"
- scientificPapers: Array of 3 UNIQUE papers specific to the EXACT ingredient and health goal, each with:
  - title: Full paper title that MUST include the specific ingredient name/form (e.g., "Magnesium Glycinate" not "Magnesium")
  - authors: First author et al.
  - journal: Journal name
  - year: Publication year (prefer recent: 2015-2024)
  - pmid: PubMed ID (realistic format)
  - summary: One-sentence plain-English finding specific to this ingredient and health benefit
  
  CRITICAL PAPER REQUIREMENTS:
  * Each supplement MUST have completely DIFFERENT papers - no duplicates across supplements
  * Paper 1: Efficacy study (does this specific ingredient work for this health goal?)
  * Paper 2: Mechanism study (how does this specific ingredient work biologically?)
  * Paper 3: Safety/dosage study (what's the optimal dose for this specific ingredient?)
  * Include the specific ingredient FORM (glycinate vs citrate vs oxide) in paper titles
  * Make papers specific to the health goal (e.g., "for sleep" not "for health")
  
- socialTrends: Array of 2-3 trending hashtags/keywords with:
  - platform: "TikTok", "Instagram", or "Reddit"
  - hashtag: Relevant hashtag (e.g., "#CollagenGlow")
  - mentions: Approximate post count (realistic numbers)
- personalizedReason: 2-3 sentence personalized explanation of why this supplement is good for the user based on their profile, questionnaire answers, and genetics (if provided). Make it specific to THEIR situation.
- recommendedDose: Specific daily dose recommendation adjusted for the user's profile (age, sex, activity level, etc.)

Return ONLY valid JSON array with no markdown formatting or explanation.`;

    const userPrompt = `Generate 3 supplement recommendations for this health goal: "${query}"

Focus on supplements that have real scientific backing and user reviews. Be specific with dosages, timeframes, and warnings. Make sure the recommendations are relevant to the specific health goal.${profileContext}${answersContext}

CRITICAL INSTRUCTIONS:
1. Create highly personalized "personalizedReason" and "recommendedDose" fields that reflect the user's unique profile, questionnaire answers, and genetic data. Don't use generic explanations—make them specific to THIS user's situation.

2. For scientificPapers, generate 3 COMPLETELY UNIQUE papers for each supplement:
   - Each supplement must have DIFFERENT papers (no overlaps)
   - Include the EXACT ingredient name/form in paper titles (e.g., "Magnesium Glycinate Improves Sleep Onset" not "Magnesium Effects on Health")
   - Make papers specific to the health goal "${query}"
   - Use different research angles:
     * Paper 1: Efficacy/effectiveness study
     * Paper 2: Biological mechanism study  
     * Paper 3: Safety/dosage optimization study
   - Ensure each paper title is distinct and ingredient-specific

Example for "${query}":
If recommending Magnesium Glycinate, papers should be like:
- "Magnesium Glycinate Supplementation Improves ${query}: Randomized Controlled Trial"
- "Mechanisms of Magnesium in GABA Receptor Modulation Related to ${query}"
- "Optimal Dosing of Magnesium Glycinate for ${query}: Meta-Analysis"

NOT generic like "Effects of Magnesium on Health" or "Magnesium and Wellness"`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Raw AI response:", content);

    // Parse the JSON response
    let supplements;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      supplements = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI response");
    }

    console.log("Generated supplements:", supplements);

    // Step 2: Fetch real PubMed papers for each supplement and filter with AI
    if (Array.isArray(supplements)) {
      // Fetch PubMed papers for each supplement sequentially (to respect rate limits)
      const supplementsWithRealPapers = [];
      
      for (const supplement of supplements) {
        try {
          // Extract main ingredient name for PubMed search
          const mainIngredient = Array.isArray(supplement.ingredients) && supplement.ingredients.length > 0
            ? typeof supplement.ingredients[0] === 'string'
              ? supplement.ingredients[0].split(':')[0].trim() // Extract just ingredient name, not dosage
              : supplement.ingredients[0].name
            : supplement.name;
          
          console.log(`Searching PubMed for: ${mainIngredient} + ${query}`);
          
          // Search PubMed for 10-20 papers
          const allPapers = await searchPubMed(mainIngredient, query);
          
          if (allPapers.length > 0) {
            console.log(`Found ${allPapers.length} papers, filtering with AI...`);
            
            // Use AI to filter down to the 3 most relevant
            const filteredPapers = await filterPapersWithAI(allPapers, mainIngredient, query, LOVABLE_API_KEY);
            
            console.log(`Filtered to ${filteredPapers.length} best papers for ${mainIngredient}`);
            
            // Calculate evidence level based on filtered papers
            const studyTypes = filteredPapers.map((p: any) => p.studyType);
            let evidenceLevel = supplement.evidenceLevel;
            
            if (studyTypes.includes('meta-analysis') || studyTypes.includes('systematic-review')) {
              evidenceLevel = 'A';
            } else if (studyTypes.filter((t: string) => t === 'rct').length >= 2) {
              evidenceLevel = 'A';
            } else if (studyTypes.includes('rct')) {
              evidenceLevel = 'B';
            } else if (filteredPapers.length >= 2) {
              evidenceLevel = 'C';
            } else {
              evidenceLevel = 'D';
            }
            
            supplementsWithRealPapers.push({
              ...supplement,
              scientificPapers: filteredPapers,
              evidenceLevel,
              dataSource: 'pubmed'
            });
          } else {
            console.log(`No papers found for ${mainIngredient}, keeping AI-generated papers`);
            supplementsWithRealPapers.push(supplement);
          }
        } catch (error) {
          console.error('Error processing papers:', error);
          supplementsWithRealPapers.push(supplement); // Fallback to AI-generated papers
        }
      }
      
      return new Response(
        JSON.stringify({ supplements: supplementsWithRealPapers }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ supplements }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-supplements:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        supplements: [] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
