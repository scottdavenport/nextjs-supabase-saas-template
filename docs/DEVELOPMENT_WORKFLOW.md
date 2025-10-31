# Development Workflow Guide

This guide explains the complete development workflow, including database migrations, testing, and deployment.

## Overview

This template uses a **cloud-based development workflow** that avoids common Docker/local Supabase issues while maintaining safety through preview branches and automated testing.

### Key Principles

- **Local development connects to cloud Supabase** (no Docker required)
- **Migrations applied during development** (safe pre-launch)
- **Preview branches validate migrations** before official deployment
- **Vercel integration** automatically connects previews to Supabase preview branches

## Finding Your Project Reference

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Settings → General
4. **Copy the Project URL**: It looks like `https://your-actual-project-ref.supabase.co`
5. **Extract the reference**: The part before `.supabase.co` is your project reference

### Example
- **Project URL**: `https://abcdefghijklmnop.supabase.co`
- **Project Reference**: `abcdefghijklmnop`
- **Use in commands**: `supabase link --project-ref abcdefghijklmnop`

## Development Environment

### Your `.env.local` Configuration

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SUPABASE_SECRET_KEY=<your-service-role-key>

# Add other service keys as needed
```

**Important**: Your local Next.js app connects directly to cloud Supabase. This means:
- ✅ Auth works perfectly (same auth service)
- ✅ RLS policies work correctly (same database)
- ✅ No JWT issues (same keys throughout)

## Complete Development Flow

### Step 1: Create Feature Branch

```bash
git checkout -b feat/your-feature-name
```

### Step 2: Create Migration File

```bash
# If not already linked, link to production
supabase link --project-ref your-project-ref

# Create migration file
supabase migration new add_your_feature

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_your_feature.sql
```

### Step 3: Write Migration SQL

Follow these **safety guidelines**:

#### ✅ Safe Migrations (Additive Only)

```sql
-- Add new table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Add new column to existing table (with DEFAULT)
ALTER TABLE profiles 
ADD COLUMN display_name TEXT DEFAULT NULL;

-- Add index for performance
CREATE INDEX idx_user_preferences_user_id 
ON user_preferences(user_id);
```

#### ⚠️ Risky Migrations (Avoid Pre-Launch)

```sql
-- ❌ Don't drop columns (loses data)
ALTER TABLE profiles DROP COLUMN email;

-- ❌ Don't change column types (can truncate data)
ALTER TABLE profiles ALTER COLUMN username TYPE VARCHAR(10);

-- ❌ Don't rename columns (breaks code immediately)
ALTER TABLE profiles RENAME COLUMN email TO user_email;
```

### Step 4: Apply Migration

```bash
# Dry run (preview changes)
supabase db push --dry-run

# Apply to linked project
supabase db push
```

### Step 5: Develop Locally

Your local app (via `.env.local`) now works with the new schema. Develop and test your feature.

### Step 6: Commit Changes

```bash
git add .
git commit -m "feat: add user preferences feature"
```

### Step 7: Create PR

Push your branch and create a PR. GitHub/Supabase integration will:
- Create a preview branch in Supabase
- Deploy to Vercel preview
- Test migrations on fresh database

### Step 8: Test on Preview

1. Vercel creates preview deployment automatically
2. Test your changes on the preview URL
3. Verify migrations work correctly
4. Test all functionality

### Step 9: Merge PR

Once approved:
- Merge PR to main
- Migration already in production (no-op)
- Preview branch deleted automatically

## Migration Best Practices

### Always Use Additive Migrations

Prefer adding new things over modifying existing:
- ✅ `CREATE TABLE`
- ✅ `ADD COLUMN` with `DEFAULT`
- ✅ `CREATE INDEX`
- ❌ `DROP`, `ALTER TYPE`, `RENAME`

### Use Transactions

```sql
BEGIN;

-- Add column
ALTER TABLE profiles ADD COLUMN bio TEXT;

-- Backfill data
UPDATE profiles 
SET bio = COALESCE(first_name || ' ' || last_name, '')
WHERE bio IS NULL;

COMMIT;
```

### Test RLS Policies

Always verify RLS policies work correctly:

```sql
-- Test as authenticated user
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '<test-user-uuid>';

-- Try to access data
SELECT * FROM user_preferences;
-- Should only return current user's preferences
```

## Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in headed mode
pnpm test:headed
```

### Test Setup

Ensure you have test credentials in `.env.local`:
```bash
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test-password-123
```

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Environment Variables**: Use `pnpm setup:vercel` or manually set in dashboard
3. **Deploy**: Automatic on push to main

### Preview Deployments

- Automatically created on PRs
- Connect to Supabase preview branches
- Test before merging

## Common Issues

### JWT Errors
**Error**: "JWT expects 3 parts and got 1"

**Solution**: Ensure `.env.local` uses consistent keys:
```bash
# ✅ All cloud keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<cloud-key>
```

### Migration Conflicts
**Error**: Migration conflict on preview branch

**Solution**:
1. Delete preview branch in Supabase dashboard
2. Close and reopen PR
3. New preview branch created with fresh migrations

### RLS Policy Issues
**Error**: Row Level Security prevents data access

**Debug**:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View policies for table
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

