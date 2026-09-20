# Fix Designer Migration Issue

## Problem
You're getting this error:
```
⚠️ We found changes that cannot be executed:
  • Added the required column `userId` to the `Designer` table without a default value. 
    There are 1 rows in this table, it is not possible to execute this step.
```

This happens because:
- There's already a Designer record in your database
- The schema now requires `userId` (which links Designer to User)
- The existing Designer record doesn't have a `userId`

## Solution

### Option 1: Fix Existing Data (Recommended)
Run the migration fix script:

```bash
npm run db:fix-designer
```

This script will:
1. Find all Designer records without `userId`
2. Try to link them to existing Users (by matching email)
3. Delete orphaned Designer records that can't be linked
4. Verify all Designers are properly linked

After running this, you can then run:
```bash
npm run db:push
```

### Option 2: Reset Database (⚠️ Deletes All Data)
If you don't mind losing all data:

```bash
# Delete the database file
rm dev.db  # or delete it manually

# Then push the schema
npm run db:push

# Then seed with sample data
npm run db:seed
```

### Option 3: Manual Fix
If you want to manually fix it:

1. Open Prisma Studio:
```bash
npm run db:studio
```

2. Find the Designer record and either:
   - Delete it if it's test data
   - Or manually link it to a User by setting `userId`

3. Then run:
```bash
npm run db:push
```

## After Fixing

Once the migration is fixed, designer sign-up should work properly. The registration process will:
1. Create a User account
2. Create a Designer record linked to that User
3. Both will be properly connected

