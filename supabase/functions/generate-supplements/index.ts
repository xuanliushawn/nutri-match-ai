import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
- scientificPapers: Array of 3 relevant papers, each with:
  - title: Full paper title
  - authors: First author et al.
  - journal: Journal name
  - year: Publication year
  - pmid: PubMed ID (realistic format)
  - summary: One-sentence plain-English finding
- socialTrends: Array of 2-3 trending hashtags/keywords with:
  - platform: "TikTok", "Instagram", or "Reddit"
  - hashtag: Relevant hashtag (e.g., "#CollagenGlow")
  - mentions: Approximate post count (realistic numbers)
- personalizedReason: 2-3 sentence personalized explanation of why this supplement is good for the user based on their profile, questionnaire answers, and genetics (if provided). Make it specific to THEIR situation.
- recommendedDose: Specific daily dose recommendation adjusted for the user's profile (age, sex, activity level, etc.)

Return ONLY valid JSON array with no markdown formatting or explanation.`;

    const userPrompt = `Generate 3 supplement recommendations for this health goal: "${query}"

Focus on supplements that have real scientific backing and user reviews. Be specific with dosages, timeframes, and warnings. Make sure the recommendations are relevant to the specific health goal.${profileContext}${answersContext}

CRITICAL: Create highly personalized "personalizedReason" and "recommendedDose" fields that reflect the user's unique profile, questionnaire answers, and genetic data. Don't use generic explanations—make them specific to THIS user's situation.`;

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

    // Step 2: Fetch real PubMed papers for each supplement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (supabaseUrl && supabaseKey && Array.isArray(supplements)) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch PubMed papers for each supplement in parallel
      const pubmedPromises = supplements.map(async (supplement: any) => {
        try {
          // Extract main ingredient name for PubMed search
          const mainIngredient = Array.isArray(supplement.ingredients) && supplement.ingredients.length > 0
            ? typeof supplement.ingredients[0] === 'string'
              ? supplement.ingredients[0]
              : supplement.ingredients[0].name
            : supplement.name;
          
          console.log(`Fetching PubMed papers for: ${mainIngredient}`);
          
          const { data: pubmedData, error: pubmedError } = await supabase.functions.invoke(
            'fetch-pubmed-papers',
            { body: { ingredientName: mainIngredient, maxResults: 3 } }
          );
          
          if (pubmedError) {
            console.error(`PubMed fetch error for ${mainIngredient}:`, pubmedError);
            return supplement; // Return original with AI-generated papers
          }
          
          if (pubmedData?.papers && pubmedData.papers.length > 0) {
            console.log(`Got ${pubmedData.papers.length} real papers for ${mainIngredient}`);
            
            // Calculate evidence level based on real papers
            const studyTypes = pubmedData.papers.map((p: any) => p.studyType);
            let evidenceLevel = supplement.evidenceLevel;
            
            if (studyTypes.includes('meta-analysis') || studyTypes.includes('systematic-review')) {
              evidenceLevel = 'A';
            } else if (studyTypes.filter((t: string) => t === 'rct').length >= 2) {
              evidenceLevel = 'A';
            } else if (studyTypes.includes('rct')) {
              evidenceLevel = 'B';
            } else if (pubmedData.papers.length >= 2) {
              evidenceLevel = 'C';
            } else {
              evidenceLevel = 'D';
            }
            
            return {
              ...supplement,
              scientificPapers: pubmedData.papers,
              evidenceLevel,
              dataSource: 'pubmed'
            };
          }
          
          return supplement; // Keep AI-generated papers if PubMed fails
        } catch (error) {
          console.error('Error fetching PubMed papers:', error);
          return supplement; // Fallback to AI-generated papers
        }
      });
      
      const supplementsWithRealPapers = await Promise.all(pubmedPromises);
      
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
