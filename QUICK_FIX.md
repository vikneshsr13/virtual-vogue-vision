# Quick Fix Guide

## To Add 20 Dresses with Images

Run this command to seed the database with 20 dress products:

```bash
npm run db:seed
```

This will:
- Clear existing products
- Add 20 new dress products with:
  - Real images from Unsplash
  - Prices in USD and INR
  - Detailed descriptions
  - Taglines
  - Categories, brands, and colors

## Text Visibility Issues - FIXED ✅

The text visibility issue has been fixed by:
- Removing dark mode CSS that was causing white text on white background
- Setting explicit text colors to dark gray (#1f2937)
- Setting background to light gray (#f9fafb)

## Features Status

All features are now working:

✅ **Shopping Cart** - Add/remove items, view cart
✅ **Checkout** - Complete orders with shipping address
✅ **Virtual Wardrobe** - Add items, AI tags (with fallback if no API key)
✅ **AI Assistant** - Chat interface (with fallback message if no API key)
✅ **Mood Analyzer** - Analyze mood and get recommendations (with fallback)
✅ **Trends** - View fashion trends (with fallback trends if no API key)
✅ **Customization** - Request customizations from designers

## If AI Features Don't Work

If you don't have a Gemini API key, the features will still work but with limited AI functionality:
- Wardrobe tags will use basic keyword matching
- AI Assistant will show a message about needing API key
- Mood Analyzer will return default recommendations
- Trends will show fallback trends

To enable full AI features:
1. Get API key from: https://makersuite.google.com/app/apikey
2. Add to `.env` file: `GEMINI_API_KEY=your-key-here`
3. Restart the server

## After Seeding

After running `npm run db:seed`, refresh your browser to see all 20 dresses!

