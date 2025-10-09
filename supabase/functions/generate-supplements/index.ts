import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!query) {
      throw new Error("Query parameter is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating supplements for query:", query);

    const systemPrompt = `You are a supplement recommendation AI that analyzes health goals and recommends evidence-based supplements.

For each health goal, provide exactly 3 supplement recommendations in JSON format. Each recommendation should include:
- name: Product name
- description: Brief product description (max 100 chars)
- socialSentiment: Score from 60-95 representing user satisfaction percentage
- evidenceLevel: "A" (strong clinical evidence), "B" (moderate evidence), "C" (limited evidence), or "D" (insufficient)
- keyBenefits: Array of 3-4 specific benefits with percentages/timeframes
- warnings: Array of 2-3 important safety warnings or contraindications
- ingredients: Array of 3-5 key active ingredients with dosages
- price: Price range like "$24.99" or "$28-32"

Return ONLY valid JSON array with no markdown formatting or explanation.`;

    const userPrompt = `Generate 3 supplement recommendations for this health goal: "${query}"

Focus on supplements that have real scientific backing and user reviews. Be specific with dosages, timeframes, and warnings. Make sure the recommendations are relevant to the specific health goal.`;

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
