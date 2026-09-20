# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-here-generate-with-openssl-rand-base64-32
   GEMINI_API_KEY=your-google-gemini-api-key
   ```

   To generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed Sample Data (Optional)**
   ```bash
   npm run db:seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting a Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Features Overview

### Authentication
- Sign up at `/signup`
- Sign in at `/signin`
- Protected routes require authentication

### Shopping
- Browse products on homepage (`/`)
- Add items to cart
- View cart at `/cart`
- Checkout at `/checkout`
- View orders at `/orders`

### AI Features
- **Virtual Wardrobe** (`/wardrobe`): Add items, create outfits, get AI-generated tags
- **AI Assistant** (`/ai-assistant`): Chat with AI shopping assistant
- **Mood Analyzer** (`/mood-analyzer`): Get recommendations based on mood
- **Trends** (`/trends`): View AI-analyzed fashion trends
- **Customization** (`/customize`): Request customizations from designers

## Database Management

- View database: `npm run db:studio`
- Reset database: Delete `prisma/dev.db` and run `npx prisma db push` again

## Troubleshooting

### Database Issues
- Make sure `prisma generate` has been run
- Check that `DATABASE_URL` is correct in `.env`

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your app URL

### AI Features Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has proper permissions
- Review console for error messages

