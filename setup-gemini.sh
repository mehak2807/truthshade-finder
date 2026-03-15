#!/bin/bash

# Gemini API Setup Script
# This script helps you set up the Gemini API integration

echo "🚀 Gemini API Setup for Practice Mode"
echo "====================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy from .env.example first:"
    echo "  cp .env.example .env"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if VITE_GEMINI_API_KEY is already set
if grep -q "VITE_GEMINI_API_KEY" .env; then
    echo "ℹ️  VITE_GEMINI_API_KEY already configured"
    CURRENT_KEY=$(grep "VITE_GEMINI_API_KEY" .env | cut -d'=' -f2)
    if [ "$CURRENT_KEY" != "your_gemini_api_key" ] && [ ! -z "$CURRENT_KEY" ]; then
        echo "✅ API Key appears to be set: ${CURRENT_KEY:0:10}..."
    else
        echo "⚠️  API Key not set or placeholder"
    fi
else
    echo "⚠️  VITE_GEMINI_API_KEY not found in .env"
    echo "Adding template to .env..."
    echo "" >> .env
    echo "# Gemini API Configuration" >> .env
    echo "VITE_GEMINI_API_KEY=your_gemini_api_key" >> .env
    echo "✅ Template added to .env"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Get API key from: https://aistudio.google.com/app/apikeys"
echo "2. Edit .env file and replace 'your_gemini_api_key' with your actual key"
echo "3. Save .env"
echo "4. Restart dev server: npm run dev"
echo "5. Test Practice Mode in Learn page"
echo ""

echo "📚 Documentation:"
echo "- Quick Setup: GEMINI_QUICK_SETUP.md"
echo "- Full Guide: GEMINI_API_INTEGRATION.md"
echo "- Summary: GEMINI_INTEGRATION_SUMMARY.md"
echo ""

echo "✨ Ready to integrate Gemini API!"
