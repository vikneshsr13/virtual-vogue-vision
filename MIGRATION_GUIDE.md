# Database Migration Guide

## Important: Database Schema Update

The schema has been updated to add:
1. `role` field to User model (customer/designer)
2. Link between User and Designer models

## Steps to Update Database

1. **Stop your development server** (Ctrl+C)

2. **Update the database schema:**
   ```bash
   npx prisma db push
   ```

3. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

## What Changed

- Users now have a `role` field (default: "customer")
- Designers are linked to User accounts
- Designer sign-up creates both User and Designer records

## Testing Designer Features

1. Sign up as a designer at `/designer/signup`
2. Sign in at `/designer/signin`
3. Access dashboard at `/designer/dashboard`
4. View customization orders from customers

## If You Get Errors

If you see errors about missing fields:
1. Make sure you ran `npx prisma db push`
2. Make sure you ran `npx prisma generate`
3. Restart your dev server
4. Clear browser cache and try again

