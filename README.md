# Virtual Vogue Vision

The world's first emotion-aware, designer-integrated, wardrobe-intelligent shopping ecosystem.

## Features

### Core E-Commerce
- ✅ User authentication (Sign in, Sign up)
- ✅ Product catalog with dresses (USD & INR pricing)
- ✅ Shopping cart functionality
- ✅ Checkout and order management

### AI-Powered Features

1. **Virtual Wardrobe Analyst**
   - Digitize and store your wardrobe
   - AI-generated tags using Google Gemini
   - Create mix-and-match outfits
   - Get recommendations based on your wardrobe

2. **Trend Analyzer**
   - AI-driven trend analysis
   - Real-time fashion trend recommendations

3. **AI Shopping Assistant**
   - 24/7 chat-based shopping assistant
   - Product recommendations
   - Size and fit suggestions
   - Style matching

4. **Personal Customization**
   - Connect with fashion designers
   - Request customizations for purchased items
   - Track customization orders

5. **Mood & Impression Analyzer**
   - Analyze your mood and desired impression
   - Get personalized product recommendations
   - Emotion-aware shopping experience

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL` - SQLite database path (default: `file:./dev.db`)
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (default: `http://localhost:3000`)
- `GEMINI_API_KEY` - Your Google Gemini API key

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Seed sample data (optional):
```bash
# You can add products via the API or create a seed script
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma with SQLite (can be switched to PostgreSQL)
- **Authentication**: NextAuth.js
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── cart/         # Shopping cart page
│   ├── checkout/     # Checkout page
│   ├── wardrobe/     # Virtual wardrobe
│   ├── ai-assistant/ # AI shopping assistant
│   ├── customize/    # Customization orders
│   ├── mood-analyzer/# Mood analyzer
│   └── ...
├── components/       # React components
├── lib/              # Utilities (Prisma, Gemini, Auth)
└── prisma/           # Database schema
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET /api/products` - Get all products
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart items
- `POST /api/orders` - Create order
- `GET /api/wardrobe` - Get wardrobe items
- `POST /api/wardrobe` - Add wardrobe item
- `POST /api/ai/chat` - AI assistant chat
- `POST /api/mood/analyze` - Mood analysis
- `POST /api/customize` - Create customization order

## Notes

- Make sure to add your Google Gemini API key in `.env`
- The database uses SQLite by default for easy setup
- For production, consider switching to PostgreSQL
- Add sample products via the API or create a seed script

