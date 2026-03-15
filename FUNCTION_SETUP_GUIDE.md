# Supabase Functions Setup Guide

## Problem: "Failed to send request" Error

The fact-checking functions require an API key to work. Here's how to fix it:

---

## Step 1: Get a Lovable API Key

The functions use `https://ai.gateway.lovable.dev` for AI analysis.

**Option A: If you have a Lovable account**
- Go to https://dashboard.lovable.dev
- Navigate to API Keys section
- Create or copy your API key
- Share with admin to set in production

**Option B: For testing/development**
- Contact the project admin for a test API key
- Once received, proceed to Step 2

---

## Step 2: Set the API Key in Supabase (Production)

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref mpuxkqevjwzgega

# Set the secret
supabase secrets set LOVABLE_API_KEY "your_api_key_here"

# Verify it's set
supabase secrets list
```

---

## Step 3: Deploy Functions to Correct Project

```bash
# Make sure config.toml has the right project ID
# It should be: project_id = "mpuxkqevjwzgega"

# Deploy all functions
supabase functions deploy

# Or deploy specific functions:
supabase functions deploy fact-check
supabase functions deploy analyze-news
supabase functions deploy screenshot-fact-check
supabase functions deploy ocr-extract
```

---

## Step 4: For Local Testing (.env)

Add this to `.env` file (if running functions locally):

```env
LOVABLE_API_KEY=your_api_key_here
```

Then test locally:
```bash
supabase functions serve
```

---

## Verify Setup

Test the API endpoint:

```bash
curl -X POST https://mpuxkqevjwzgega.supabase.co/functions/v1/fact-check \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test misinformation claim",
    "language": "auto",
    "type": "text"
  }'
```

Expected response should have `credibility_score`, `verdict`, `explanation`, etc.

---

## Troubleshooting

**Error: "LOVABLE_API_KEY is not configured"**
- API key is missing from Supabase secrets
- Run: `supabase secrets set LOVABLE_API_KEY "your_key"`

**Error: "Function not found"**
- Functions haven't been deployed to the correct project
- Check: `config.toml` has `project_id = "mpuxkqevjwzgega"`
- Run: `supabase functions deploy`

**Error: "CORS error"**  
- Functions are deployed to wrong project
- Verify frontend .env matches Supabase project ID

---

## Key Files Updated

- ✅ `supabase/config.toml` - Fixed project ID to `mpuxkqevjwzgega`
- ✅ `.env.example` - Added LOVABLE_API_KEY documentation
- ✅ `extension/background.js` - Fixed API endpoint (done earlier)

---

## Next Steps

1. Obtain the Lovable API key from admin
2. Set it in Supabase: `supabase secrets set LOVABLE_API_KEY "..."`
3. Deploy functions: `supabase functions deploy`
4. Test the misinformation detection page - error should be resolved!
