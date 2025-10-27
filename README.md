# Next.js + Supabase SaaS Template

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A production-ready SaaS template with authentication, database, and modern tooling**

[Quick Start](#quick-start) • [Features](#features) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

## 🚀 Quick Start

```bash
# Clone the template
git clone https://github.com/your-username/nextjs-supabase-saas-template.git my-saas-app
cd my-saas-app

# Install dependencies
pnpm install

# Run interactive setup
pnpm setup:template

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your values

# Start development
pnpm dev
```

## ✨ Features

### 🔐 Authentication
- **Email/Password** authentication with Supabase Auth
- **Google OAuth** integration (optional)
- **Apple OAuth** integration (optional)
- **Protected routes** with middleware
- **Session management** with SSR support

### 🗄️ Database
- **PostgreSQL** with Supabase
- **Row Level Security (RLS)** policies
- **Auto-profile creation** triggers
- **Encrypted token storage** for OAuth
- **File storage** for avatars

### 🎨 UI/UX
- **shadcn/ui** components
- **Tailwind CSS** styling
- **Dark/light mode** support
- **Responsive design**
- **Accessible components**

### 🛠️ Developer Experience
- **TypeScript** throughout
- **ESLint** configuration
- **Hot reload** with warnings disabled
- **Helper scripts** for setup
- **Comprehensive documentation**

### 📊 Monitoring & Analytics
- **Sentry** error tracking (optional)
- **Vercel Analytics** (optional)
- **Performance monitoring**

### 🔧 Integrations
- **OAuth pattern** for external services
- **Webhook handling** examples
- **Background jobs** with Inngest
- **File upload** system

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Public pages (login, signup)
│   ├── (protected)/          # Authenticated app area
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── auth/                 # Authentication components
│   └── settings/             # Settings components
├── lib/
│   ├── supabase/             # Supabase client factories
│   ├── auth/                 # Auth utilities
│   └── utils.ts              # Shared utilities
└── worker/
    ├── inngest.ts            # Inngest client
    └── jobs/                 # Background job functions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Package Manager**: pnpm
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[TEMPLATE.md](./TEMPLATE.md)** - Customization guide
- **[FEATURES.md](./FEATURES.md)** - Feature documentation
- **[API.md](./API.md)** - API reference

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set up environment variables**:
   ```bash
   pnpm setup:vercel
   ```

3. **Configure Supabase**:
   - Update `NEXT_PUBLIC_SUPABASE_URL` in Vercel dashboard
   - Update `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel dashboard
   - Add `SUPABASE_SECRET_KEY` for server-side operations

### Other Platforms

The template works with any platform that supports Next.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

## 🔧 Customization

### Template Configuration

Edit `template.config.js` to customize features:

```javascript
export const defaultConfig = {
  app: {
    name: "my-saas-app",
    description: "My awesome SaaS application",
    author: "Your Name",
  },
  features: {
    auth: {
      emailPassword: true,
      googleOAuth: true,
      appleOAuth: false,
    },
    // ... more features
  },
};
```

### Adding Your Features

1. **Database Tables**: Add migrations in `supabase/migrations/`
2. **API Routes**: Create endpoints in `src/app/api/`
3. **Components**: Build UI in `src/components/`
4. **Pages**: Add routes in `src/app/`

### Removing Examples

```bash
# Remove example code after setup
pnpm cleanup:examples
```

## 🎯 Use Cases

This template is perfect for:

- **SaaS Applications** - User management, subscriptions, dashboards
- **Internal Tools** - Admin panels, data management
- **Marketplaces** - User profiles, listings, transactions
- **Content Platforms** - User-generated content, comments
- **Analytics Dashboards** - Data visualization, reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The backend platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

<div align="center">

**Built with ❤️ for the developer community**

[⭐ Star this repo](https://github.com/your-username/nextjs-supabase-saas-template) • [🐛 Report Bug](https://github.com/your-username/nextjs-supabase-saas-template/issues) • [💡 Request Feature](https://github.com/your-username/nextjs-supabase-saas-template/issues)

</div>
