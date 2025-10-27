# Setup Guide

This guide will walk you through setting up the Next.js + Supabase SaaS template from scratch.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed
- **pnpm** package manager (install via Corepack: `corepack enable`)
- **Git** installed
- **Supabase CLI** installed (`npm install -g supabase`)
- **Vercel CLI** installed (`npm install -g vercel`) - optional but recommended

## Step 1: Clone and Setup

### Clone the Template

```bash
git clone https://github.com/your-username/nextjs-supabase-saas-template.git my-saas-app
cd my-saas-app
```

### Install Dependencies

```bash
pnpm install
```

### Run Interactive Setup

```bash
pnpm setup:template
```

This will ask you:
- App name (kebab-case)
- App description
- Author name
- Database table prefix (optional)
- Which features to include

## Step 2: Environment Configuration

### Copy Environment Template

```bash
cp env.example .env.local
```

### Required Environment Variables

Edit `.env.local` with your values:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Optional: Sentry Error Monitoring
SENTRY_AUTH_TOKEN=your_sentry_token

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Background Jobs
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Optional: AI Integration
OPENROUTER_API_KEY=your_openrouter_key
```

## Step 3: Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Your app name
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role** key → `SUPABASE_SECRET_KEY`

### Initialize Local Supabase

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_ref

# Start local development
supabase start
```

### Run Database Migrations

```bash
# Reset database with migrations
supabase db reset

# Or apply migrations to existing database
supabase db push
```

## Step 4: Authentication Setup

### Email/Password Authentication

Email/password authentication works out of the box. No additional setup required.

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
7. Copy Client ID and Secret to `.env.local`

### Apple OAuth (Optional)

1. Go to [Apple Developer Console](https://developer.apple.com)
2. Create a new App ID
3. Configure Sign in with Apple
4. Create a Service ID
5. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
6. Copy Client ID and Secret to `.env.local`

### Configure Supabase Auth

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable desired providers
3. Add OAuth credentials for each provider
4. Set redirect URLs

## Step 5: Optional Integrations

### Sentry Error Monitoring

1. Create account at [sentry.io](https://sentry.io)
2. Create a new project (Next.js)
3. Get your DSN and Auth Token
4. Add to `.env.local`:
   ```env
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   ```

### Vercel Analytics

Vercel Analytics is automatically included and works when deployed to Vercel.

### Inngest Background Jobs

1. Create account at [inngest.com](https://inngest.com)
2. Create a new app
3. Get your signing key
4. Add to `.env.local`:
   ```env
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

## Step 6: Development

### Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

### Test Authentication

1. Go to `/signup` to create an account
2. Check your email for confirmation link
3. Sign in at `/login`
4. Verify you're redirected to `/dashboard`

### Test Protected Routes

1. Try accessing `/dashboard` without being signed in
2. Verify you're redirected to `/login`
3. Sign in and verify you can access protected routes

## Step 7: Customization

### Remove Example Code

After setup, remove example code you don't need:

```bash
pnpm cleanup:examples
```

### Add Your Features

1. **Database Tables**: Add migrations in `supabase/migrations/`
2. **API Routes**: Create endpoints in `src/app/api/`
3. **Components**: Build UI in `src/components/`
4. **Pages**: Add routes in `src/app/`

### Customize Styling

- Edit `tailwind.config.js` for theme customization
- Modify `src/app/globals.css` for global styles
- Update component styles in individual files

## Step 8: Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set up environment variables**:
   ```bash
   pnpm setup:vercel
   ```

4. **Configure Supabase for production**:
   - Update redirect URLs in Supabase dashboard
   - Add production URLs to OAuth providers
   - Update environment variables in Vercel dashboard

### Deploy to Other Platforms

The template works with any platform that supports Next.js:

- **Netlify**: Connect GitHub repo, set environment variables
- **Railway**: Deploy from GitHub, configure environment
- **Render**: Connect repo, set build command to `pnpm build`

## Troubleshooting

### Common Issues

#### "Invalid login credentials"
- Check email/password are correct
- Verify email is confirmed
- Check Supabase Auth settings

#### "Failed to fetch" errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check network connectivity
- Ensure Supabase project is active

#### Database connection errors
- Verify `SUPABASE_SECRET_KEY` is correct
- Check RLS policies are properly configured
- Ensure migrations have been applied

#### OAuth redirect errors
- Verify redirect URLs match exactly
- Check OAuth provider configuration
- Ensure Supabase Auth providers are enabled

### Getting Help

- Check the [TEMPLATE.md](./TEMPLATE.md) for customization help
- Review [FEATURES.md](./FEATURES.md) for feature documentation
- Open an issue on GitHub for bugs or questions

## Next Steps

After setup is complete:

1. **Read the documentation**:
   - [TEMPLATE.md](./TEMPLATE.md) - Customization guide
   - [FEATURES.md](./FEATURES.md) - Feature documentation

2. **Start building**:
   - Add your database tables
   - Create your API endpoints
   - Build your UI components

3. **Deploy and iterate**:
   - Deploy to production
   - Monitor with Sentry
   - Gather user feedback

---

**Need help?** Open an issue or check the documentation!
