import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to search PubMed for real papers
async function searchPubMed(ingredient: string, healthGoal: string): Promise<any[]> {
  try {
    // Build search query: ingredient + health goal, but allow ANY study type
    // so we can surface more diverse papers, not only RCTs/meta-analyses.
    const searchTerm = encodeURIComponent(`${ingredient} ${healthGoal}`);
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchTerm}&retmax=20&retmode=json&sort=relevance`;
    
    console.log(`🔍 Searching PubMed for: ${ingredient} + ${healthGoal}`);
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    if (pmids.length === 0) {
      console.log(`⚠️ No PubMed results found for ${ingredient}`);
      return [];
    }
    
    console.log(`✓ Found ${pmids.length} papers, fetching details...`);
    
    // Fetch full paper details
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
    const fetchResponse = await fetch(fetchUrl);
    const xmlText = await fetchResponse.text();
    
    return parseXMLToPapers(xmlText);
  } catch (error) {
    console.error('❌ PubMed API error:', error);
    return [];
  }
}

// Parse PubMed XML response into structured paper objects
function parseXMLToPapers(xml: string): any[] {
  const papers: any[] = [];
  
  try {
    // Extract PMIDs
    const pmidMatches = xml.matchAll(/<PMID[^>]*>(\d+)<\/PMID>/g);
    const pmids = [...pmidMatches].map(m => m[1]);
    
    // Extract article titles
    const titleMatches = xml.matchAll(/<ArticleTitle>([^<]+)<\/ArticleTitle>/g);
    const titles = [...titleMatches].map(m => m[1]);
    
    // Extract journal names
    const journalMatches = xml.matchAll(/<Title>([^<]+)<\/Title>/g);
    const journals = [...journalMatches].map(m => m[1]);
    
    // Extract publication years
    const yearMatches = xml.matchAll(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/g);
    const years = [...yearMatches].map(m => m[1]);
    
    // Extract first author last name
    const authorMatches = xml.matchAll(/<Author[^>]*>[\s\S]*?<LastName>([^<]+)<\/LastName>/g);
    const authors = [...authorMatches].map(m => `${m[1]} et al.`);
    
    // Extract abstracts
    const abstractMatches = xml.matchAll(/<AbstractText[^>]*>([^<]+)<\/AbstractText>/g);
    const abstracts = [...abstractMatches].map(m => m[1]);
    
    // Combine all data into paper objects
    const minLength = Math.min(pmids.length, titles.length);
    for (let i = 0; i < minLength; i++) {
      if (titles[i] && pmids[i]) {
        papers.push({
          pmid: pmids[i],
          title: titles[i],
          journal: journals[i] || 'Journal not available',
          year: parseInt(years[i]) || new Date().getFullYear(),
          authors: authors[i] || 'Authors not available',
          abstract: abstracts[i] || ''
        });
      }
    }
    
    console.log(`✓ Parsed ${papers.length} papers from XML`);
  } catch (error) {
    console.error('❌ XML parsing error:', error);
  }
  
  return papers;
}

// Use AI to filter and select the best papers
async function filterPapersWithAI(
  papers: any[],
  ingredient: string,
  healthGoal: string,
  apiKey: string
): Promise<any[]> {
  if (papers.length === 0) return [];
  
  // Format papers for AI evaluation
  const papersText = papers.map((p, idx) => 
    `${idx + 1}. Title: "${p.title}"
    Year: ${p.year}
    Journal: ${p.journal}
    PMID: ${p.pmid}
    Abstract: ${p.abstract.substring(0, 400)}...`
  ).join('\n\n');
  
  const filterPrompt = `You are a scientific research evaluator. I have ${papers.length} REAL papers from PubMed about "${ingredient}" for "${healthGoal}".

Your task: Select the 3 MOST RELEVANT papers for this ingredient and goal.

Selection criteria (in order of importance):
1. **Direct relevance**: Paper must study ${ingredient} or a very close form of it in the context of ${healthGoal}
2. **Clarity**: The abstract clearly explains what was done and what changed
3. **Recency**: Prefer papers from the last 15 years when possible

IMPORTANT:
- You are ALLOWED to select non-clinical-trial papers (mechanistic studies, observational studies, reviews) if they are highly relevant to how ${ingredient} might help with ${healthGoal}.
- Avoid picking the same paper IDs (PMIDs) over and over when several reasonable options exist.
  
For each selected paper, you must also:
- Read its abstract carefully.
- Pick ONE exact sentence from the abstract that BEST describes what happened with the ingredient "${ingredient}" (or a very close chemical form of it) in the context of "${healthGoal}".
- The sentence MUST explicitly mention the ingredient name (or a clear synonym, e.g. "magnesium" vs "magnesium glycinate").
- Do NOT choose sentences that only describe background, methods, or other treatments without clearly connecting effects to the ingredient.
- Return that as "highlightSentence".

Papers available:
${papersText}

Return ONLY valid JSON (no markdown, no explanation):
[
  {
    "title": "exact title from above",
    "authors": "authors from above",
    "journal": "journal from above",
    "year": year_as_number,
    "pmid": "pmid from above",
    "summary": "1-2 sentences in PLAIN ENGLISH explaining the key finding and what it means for users (avoid medical jargon)",
    "highlightSentence": "ONE exact sentence copied from the abstract that best shows how this ingredient relates to the health goal"
    "isVerified": true
  }
]

Select exactly 3 papers. Only use data provided above. Make summaries simple and actionable.`;

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
    
    console.log(`✓ AI filtered to ${filtered.length} best papers`);
    return filtered.slice(0, 3);
  } catch (error) {
    console.error('❌ AI filtering error:', error);
    // Fallback: return first 3 with basic summaries
    return papers.slice(0, 3).map(p => ({
      title: p.title,
      authors: p.authors,
      journal: p.journal,
      year: p.year,
      pmid: p.pmid,
      summary: p.abstract?.substring(0, 150) || `Research study on ${ingredient} for ${healthGoal}`,
      isVerified: true
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
    if (userProfile && (userProfile.age || userProfile.sex || userProfile.activity_level || 
        (userProfile.dietary_preferences && userProfile.dietary_preferences.length > 0) ||
        (userProfile.dietary_restrictions && userProfile.dietary_restrictions.length > 0) ||
        (userProfile.allergies && userProfile.allergies.length > 0) ||
        userProfile.genetic_data_snps)) {
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

For each health goal, provide exactly 3 DIFFERENT supplement recommendations in JSON format. Each recommendation MUST be unique with different active ingredients.

CRITICAL: Each supplement must have COMPLETELY DIFFERENT ingredients and mechanisms. Do NOT recommend variations of the same ingredient.

Each recommendation should include:
- name: Product name (must be different for each supplement)
- description: Brief product description (max 100 chars)
- socialSentiment: Score from 60-95 representing user satisfaction percentage
- evidenceLevel: "A" (strong clinical evidence), "B" (moderate evidence), "C" (limited evidence), or "D" (insufficient)
- keyBenefits: Array of 3-4 specific benefits with percentages/timeframes (personalize if profile data available)
- warnings: Array of 2-3 important safety warnings or contraindications (include profile-specific warnings)
- ingredients: Array of 3-5 key active ingredients with dosages (MUST be specific form, e.g., "Magnesium Glycinate" not just "Magnesium")
- price: Price range like "$24.99" or "$28-32"
- scientificPapers: Will be replaced with real PubMed data (generate placeholder if needed)
- socialTrends: Array of 2-3 trending hashtags/keywords with:
  - platform: "TikTok", "Instagram", or "Reddit"
  - hashtag: Relevant hashtag (e.g., "#CollagenGlow")
  - mentions: Approximate post count (realistic numbers)
- personalizedReason: 2-3 sentence explanation of why this supplement may help with the health goal. If user profile or questionnaire data is provided, make it personalized to their situation. Otherwise, keep it general.
- recommendedDose: Specific daily dose recommendation. If user profile data (age, sex, activity level) is provided, adjust accordingly. Otherwise, provide standard adult dosage.

Return ONLY valid JSON array with no markdown formatting or explanation.`;

    const userPrompt = `Generate 3 COMPLETELY DIFFERENT supplement recommendations for this health goal: "${query}"

Each supplement must have:
1. Different primary active ingredient (e.g., if one has Magnesium, others should have different ingredients like Melatonin, L-Theanine, etc.)
2. Different mechanism of action
3. Different benefit profiles

Focus on supplements that have real scientific backing and user reviews. Be specific with dosages, timeframes, and warnings. Make sure the recommendations are relevant to the specific health goal.${profileContext}${answersContext}

IMPORTANT: 
${profileContext || answersContext ? '- Use the provided profile/questionnaire data to personalize "personalizedReason" and "recommendedDose" fields' : '- Since no user profile or questionnaire data is provided, keep "personalizedReason" general (focus on the health goal) and use standard adult dosages for "recommendedDose"'}
- Make each supplement UNIQUE - no overlapping ingredients
- Be specific about ingredient forms (Glycinate vs Citrate vs Oxide, etc.)`;

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

    console.log(`✓ Generated ${supplements.length} supplements, now fetching real PubMed papers...`);

    // Track which PMIDs we've already used so we don't
    // keep showing the exact same paper on every product.
    const usedPmids = new Set<string>();

    // Enhance each supplement with real PubMed papers
    for (let i = 0; i < supplements.length; i++) {
      const supplement = supplements[i];
      
      // Extract main ingredient (first ingredient or supplement name)
      const mainIngredient = supplement.ingredients?.[0]?.name || 
                           supplement.ingredients?.[0] || 
                           supplement.name;
      
      console.log(`\n[${i + 1}/${supplements.length}] Processing: ${supplement.name}`);
      console.log(`Main ingredient: ${mainIngredient}`);
      
      try {
        // Search PubMed for real papers about this specific ingredient
        const pubmedPapers = await searchPubMed(mainIngredient, query);

        // Filter out papers we've already used for previous supplements
        const freshPapers = pubmedPapers.filter((p) => !usedPmids.has(p.pmid));
        
        if (freshPapers.length === 0) {
          console.log(`⚠️ All PubMed papers for ${mainIngredient} were already used; falling back to original list.`);
        }
        const candidatePapers = freshPapers.length > 0 ? freshPapers : pubmedPapers;
        
        if (candidatePapers.length > 0) {
          // Use AI to filter and select the best 3 papers
          const filteredPapers = await filterPapersWithAI(
            candidatePapers,
            mainIngredient,
            query,
            LOVABLE_API_KEY
          );
          
          if (filteredPapers.length > 0) {
            supplement.scientificPapers = filteredPapers;
            filteredPapers.forEach((p: any) => usedPmids.add(p.pmid));
            console.log(`✓ Added ${filteredPapers.length} real PubMed papers for ${supplement.name}`);
          } else {
            console.log(`⚠️ No papers after filtering, keeping AI-generated for ${supplement.name}`);
          }
        } else {
          console.log(`⚠️ No PubMed results found for ${mainIngredient}, keeping AI-generated papers`);
        }
      } catch (error) {
        console.error(`❌ Error fetching papers for ${supplement.name}:`, error);
        // Keep AI-generated papers on error
      }
      
      // Rate limiting: PubMed allows max 3 requests per second
      // Wait 350ms between requests to be safe
      if (i < supplements.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }

    console.log("\n✅ Successfully enhanced all supplements with real scientific papers!");
    console.log("Generated supplements:", supplements);

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
