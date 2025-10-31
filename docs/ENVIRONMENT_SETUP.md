# Environment Variables Setup Guide

This guide explains how to set up environment variables for different deployment environments.

## Required Environment Variables

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `SUPABASE_SECRET_KEY` - Your Supabase service role key (server-side only)

### Google OAuth Authentication

**Important**: Google OAuth is configured in the Supabase Dashboard, **not** as an environment variable in your Next.js app.

**Configuration Steps**:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers** → **Google**
3. Enable the Google provider
4. Enter your Google OAuth Client ID and Client Secret (from Google Cloud Console)
5. Configure redirect URLs:
   - Production: `https://your-domain.com/auth/callback`
   - Local development: `http://localhost:3000/auth/callback`
   - Preview deployments: `https://your-preview-url.vercel.app/auth/callback`

**Note**: You do **NOT** need `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` in your `.env.local` file. Supabase handles OAuth secrets server-side. The secret is only used by Supabase's backend, which reads it from the Dashboard configuration.

### Optional Integrations

If you're using additional services, add their environment variables as needed:
- AI services (OpenRouter, OpenAI, etc.)
- Third-party APIs
- Background job services (Inngest, etc.)
- Webhook secrets

## Environment Setup

### 1. Local Development (.env.local)

Create a `.env.local` file in the project root:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key

# Add other service keys as needed
# NEXT_PUBLIC_API_KEY=your-api-key
# SECRET_KEY=your-secret-key
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 2. Vercel Production Environment

Set environment variables in Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the following settings:
   - **Environment**: Production
   - **Value**: Your production values

You can also use the helper script:
```bash
pnpm setup:vercel
```

### 3. Vercel Preview Environment

**Automatic Integration**: Vercel + Supabase integration is already enabled. Preview branches automatically connect to Supabase preview branches.

**Manual Setup** (if needed):
1. Same as production, but select **Preview** environment
2. Use preview-specific values for services that support it

### 4. Testing Environment Variables

For Playwright tests, ensure you have:
```bash
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test-password-123
```

## Finding Your Supabase Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role key** → `SUPABASE_SECRET_KEY` (keep this secret!)

## Security Best Practices

- ✅ Never commit `.env.local` to git
- ✅ Use `NEXT_PUBLIC_` prefix only for client-safe variables
- ✅ Keep service role keys server-side only
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/production
- ✅ Use environment-specific configurations

## Troubleshooting

### Missing Environment Variables
If you see errors about missing environment variables:
1. Check `.env.local` exists in project root
2. Verify variable names match exactly (case-sensitive)
3. Restart your dev server after adding variables

### Invalid Supabase Keys
If authentication fails:
1. Verify keys are correct in Supabase dashboard
2. Check that `NEXT_PUBLIC_SUPABASE_URL` matches your project
3. Ensure `SUPABASE_SECRET_KEY` is the service_role key (not anon key)

