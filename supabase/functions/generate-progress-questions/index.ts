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
    const { healthGoal, supplementName } = await req.json();

    if (!healthGoal || !supplementName) {
      throw new Error("healthGoal and supplementName are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are designing a tiny daily progress journal for a person using the supplement "${supplementName}" to help with "${healthGoal}".

Goal: create 3-5 SHORT, concrete questions they can answer each day to track how this supplement is affecting their specific problem.

Rules:
- Questions must be specific to "${healthGoal}" (e.g., hair shedding, joint pain, sleep quality), not generic mood questions.
- Use simple language that a non-medical person understands.
- Focus on symptoms, function, and quality of life (e.g., pain, energy, confidence, sleep, daily activities).
- Include at least one question about side effects or new symptoms.
- Each question should fit on one line.

Return ONLY valid JSON in this shape (no extra text, no markdown):
{
  "questions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error (progress questions):", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content as string;
    const clean = content.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("AI did not return questions array");
    }

    return new Response(
      JSON.stringify({ questions: parsed.questions.slice(0, 5) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-progress-questions:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        questions: [],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
