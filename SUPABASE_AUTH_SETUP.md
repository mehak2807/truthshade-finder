# Supabase Authentication Setup Guide

## Issue: Email Verification Required

Your Supabase project has **email verification enabled by default**. This means when users sign up, they must verify their email before they can sign in.

## Solution: Disable Email Verification

To allow users to sign up and immediately sign in without email verification, follow these steps:

### 1. Go to Supabase Dashboard

- Visit: https://app.supabase.com/
- Select your project: `truthshade-finder`

### 2. Disable Email Confirmation

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Click to expand it
4. **Uncheck "Confirm email"** option
5. Click **Save**

### 3. Clear Browser Cache

After making changes to Supabase:

1. Clear browser cookies/localStorage for your app
2. Or open an **incognito/private window**
3. Try signing up again

## Current Status

✅ Code is ready to accept users without email verification
❌ Supabase is still requiring email verification (need to disable in dashboard)

## Testing After Fix

1. **Sign Up** with any email and password
2. **Automatically redirected** to `/analyze` page
3. **Sign Out** and sign back in with same credentials
4. Everything should work seamlessly

## Supabase Project Details

```
Project ID: rbbdjyhijolreehhojva
URL: https://rbbdjyhijolreehhojva.supabase.co
```

## If Email Verification is Required

If you need to keep email verification enabled, users would:

1. Sign up → Get verification email
2. Click verification link in email
3. Then they can sign in

But this requires email to be properly configured in Supabase.
