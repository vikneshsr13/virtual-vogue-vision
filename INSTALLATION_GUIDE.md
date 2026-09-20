# Step-by-Step Installation Guide

## Prerequisites
- Node.js (v18 or higher) installed
- npm or yarn package manager
- A Google account (for Gemini API key)

---

## Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js framework
- React and React DOM
- Prisma (database ORM)
- NextAuth (authentication)
- Google Gemini AI
- Tailwind CSS
- And all other dependencies

**Expected output:** You should see packages being downloaded and installed. Wait until you see "added X packages" message.

---

## Step 2: Set Up Environment Variables

1. **Create a `.env` file** in the root directory (same folder as `package.json`)

2. **Copy this template** into your `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here
```

3. **Generate a secure NEXTAUTH_SECRET:**

   **On Windows (PowerShell):**
   ```powershell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
   ```
   
   **On Mac/Linux:**
   ```bash
   openssl rand -base64 32
   ```
   
   Copy the generated string and replace `your-secret-key-here` in your `.env` file.

4. **Get Google Gemini API Key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key" or "Get API Key"
   - Copy the API key
   - Replace `your-gemini-api-key-here` in your `.env` file

**Your `.env` file should look like this:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123xyz789... (your generated secret)
GEMINI_API_KEY=AIzaSy... (your Gemini API key)
```

---

## Step 3: Set Up Database

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
   This creates the Prisma Client based on your schema.

2. **Create and push database schema:**
   ```bash
   npx prisma db push
   ```
   This creates the SQLite database file (`dev.db`) and sets up all tables.

**Expected output:** You should see:
```
✔ Generated Prisma Client
✔ Database synchronized
```

---

## Step 4: (Optional) Seed Sample Data

To add sample products and a designer to your database:

```bash
npm run db:seed
```

This will add:
- 5 sample dress products
- 1 sample fashion designer

**Note:** If you skip this step, you can still use the app, but you'll need to add products manually through the API.

---

## Step 5: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## Step 6: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the sign-in page

---

## Step 7: Create Your First Account

1. Click "Sign Up" or go to: **http://localhost:3000/signup**
2. Fill in:
   - Name
   - Email
   - Password (minimum 6 characters)
3. Click "Sign Up"
4. You'll be redirected to the sign-in page
5. Sign in with your credentials
6. You'll be taken to the homepage!

---

## Step 8: Verify Database Connection

To verify your database is working:

1. **Open Prisma Studio** (database GUI):
   ```bash
   npm run db:studio
   ```
   This opens a web interface at http://localhost:5555 where you can view/edit your database.

2. **Check database file:**
   - Look for `prisma/dev.db` file in your project
   - This is your SQLite database

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure you ran `npm install` and it completed successfully.

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate` again.

### Issue: "Database not found"
**Solution:** 
1. Make sure `DATABASE_URL` in `.env` points to `file:./dev.db`
2. Run `npx prisma db push` again

### Issue: "NEXTAUTH_SECRET is missing"
**Solution:** Make sure your `.env` file has `NEXTAUTH_SECRET` set with a valid value.

### Issue: "GEMINI_API_KEY is missing"
**Solution:** 
- AI features won't work without this
- Get your API key from https://makersuite.google.com/app/apikey
- Add it to your `.env` file

### Issue: Port 3000 already in use
**Solution:** 
- Close other applications using port 3000, OR
- Change the port: `npm run dev -- -p 3001`

### Issue: Database locked errors
**Solution:**
- Close Prisma Studio if it's open
- Make sure only one process is accessing the database at a time

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Set up database
npx prisma db push

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev

# Open database GUI
npm run db:studio

# Build for production
npm run build

# Start production server
npm start
```

---

## Next Steps After Installation

1. ✅ Sign up and create an account
2. ✅ Browse the homepage (add sample products if you seeded)
3. ✅ Try adding items to your cart
4. ✅ Explore the Virtual Wardrobe feature
5. ✅ Chat with the AI Assistant
6. ✅ Try the Mood Analyzer
7. ✅ Check out the Trends page

---

## Need Help?

- Check the `README.md` for feature documentation
- Review `SETUP.md` for additional setup details
- Check the console/terminal for error messages
- Verify all environment variables are set correctly

