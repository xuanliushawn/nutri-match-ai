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
    const { query } = await req.json();
    
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

    console.log("Generating coaching advice for query:", query);

    let profileContext = "";
    if (userProfile) {
      profileContext = `\n\nUser Profile Context:
- Age: ${userProfile.age || "Not specified"}
- Sex: ${userProfile.sex || "Not specified"}
- Activity Level: ${userProfile.activity_level || "Not specified"}
- Height: ${userProfile.height ? `${userProfile.height}cm` : "Not specified"}
- Weight: ${userProfile.weight ? `${userProfile.weight}kg` : "Not specified"}

Consider this profile when providing coaching advice. Adjust technique recommendations based on age, activity level, and physical attributes.`;
    }

    const systemPrompt = `You are an expert sports coach AI that provides personalized training advice based on YouTube video content and coaching best practices.

For each coaching question, provide advice in JSON format with these fields:
- title: Short title for the coaching advice
- mainAdvice: 3-4 sentence overview of the main coaching point
- personalizedReason: 2-3 sentences explaining why this approach suits the user's profile
- techniqueTips: Array of 4-5 specific technique tips
- commonMistakes: Array of 3-4 common mistakes to avoid
- progressionSteps: Array of 4-5 progressive steps to improve
- youtubeVideos: Array of 3 relevant videos, each with:
  - title: Video title
  - channel: Channel name
  - url: YouTube URL (use realistic format)
  - relevantTimestamp: Time to start watching (e.g., "2:15")
  - keyTakeaway: One sentence summarizing what to learn from this video
- equipmentNeeded: Array of equipment items needed (can be empty)

Reference real coaching concepts from popular YouTube channels. Make recommendations specific and actionable.

Return ONLY valid JSON with no markdown formatting.`;

    const userPrompt = `Provide coaching advice for: "${query}"

Act as if you've analyzed expert YouTube coaching videos on this topic. Reference techniques and drills that would realistically appear in top coaching channels.${profileContext}

CRITICAL: Create highly personalized advice based on the user's profile. Adjust technique recommendations for their age, activity level, and physical attributes.`;

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
    let advice;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      advice = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI response");
    }

    console.log("Generated coaching advice:", advice);

    return new Response(
      JSON.stringify({ advice }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-coaching:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        advice: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
