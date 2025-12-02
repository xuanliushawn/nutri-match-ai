# Integrate Your Gemini Pro API

Currently, the app uses **Gemini 2.5 Flash** via the Lovable AI Gateway. To use your **Gemini Pro** subscription directly:

## Step 1: Get Your Google AI API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

## Step 2: Configure Supabase Environment

Add your Google AI API key to your Supabase project:

### Option A: Using Supabase CLI (Local Development)

1. Create or edit `.env.local` in your project root:
```bash
GOOGLE_AI_API_KEY=your_actual_key_here
```

2. In `supabase/config.toml`, ensure your functions can access it:
```toml
[functions.generate-supplements.env]
GOOGLE_AI_API_KEY = "${GOOGLE_AI_API_KEY}"

[functions.generate-progress-questions.env]
GOOGLE_AI_API_KEY = "${GOOGLE_AI_API_KEY}"
```

### Option B: Using Supabase Dashboard (Production)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add environment variable:
   - Name: `GOOGLE_AI_API_KEY`
   - Value: your API key

## Step 3: Update Edge Functions

The code needs to be modified to support Google's Gemini API format. I can help you:

1. Add support for both APIs (auto-detect which key is available)
2. Use Gemini Pro (`gemini-1.5-pro`) or Gemini 2.0 Flash Experimental (`gemini-2.0-flash-exp`)
3. Keep the Lovable gateway as fallback

## Models Available with Gemini Pro:

- `gemini-1.5-pro` - Most capable, best reasoning
- `gemini-1.5-flash` - Faster, still very capable
- `gemini-2.0-flash-exp` - Latest experimental (free during preview)

## Cost Comparison:

- **Lovable Gateway**: Uses their credits/quota
- **Your Gemini Pro**: 
  - 1.5 Pro: $7/million input tokens, $21/million output
  - 1.5 Flash: $0.35/million input, $1.05/million output  
  - 2.0 Flash Exp: FREE during preview period

Would you like me to update the edge functions to support direct Google Gemini API calls?
