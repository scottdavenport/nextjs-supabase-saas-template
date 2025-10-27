# Template Customization Guide

This guide explains how to customize the Next.js + Supabase SaaS template for your specific needs.

## Configuration System

The template uses `template.config.js` to manage features and customization:

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
    integrations: {
      exampleOAuth: true,
      fileUpload: true,
    },
    monitoring: {
      sentry: true,
      vercelAnalytics: true,
    },
    examples: {
      chatMessages: true,
      aiRequests: true,
      externalAccounts: true,
    },
  },
  database: {
    prefix: "myapp",
  },
};
```

## Customizing App Information

### App Name and Description

Update the app information in `template.config.js`:

```javascript
app: {
  name: "my-awesome-saas",
  description: "A revolutionary SaaS platform for managing workflows",
  author: "Your Company Name",
}
```

This will update:
- `package.json` name and description
- Page titles and meta tags
- Documentation references

### Branding

Update branding in these files:

1. **Favicon**: Replace `src/app/favicon.ico`
2. **Logo**: Update logo references in components
3. **Colors**: Modify `tailwind.config.js` theme colors
4. **Fonts**: Update font families in `tailwind.config.js`

## Feature Management

### Authentication Features

#### Email/Password Authentication
```javascript
auth: {
  emailPassword: true, // Always enabled
}
```

#### Google OAuth
```javascript
auth: {
  googleOAuth: true, // Enable Google sign-in
}
```

**Setup required**:
1. Google Cloud Console project
2. OAuth 2.0 credentials
3. Supabase Auth provider configuration

#### Apple OAuth
```javascript
auth: {
  appleOAuth: true, // Enable Apple sign-in
}
```

**Setup required**:
1. Apple Developer account
2. App ID and Service ID
3. Supabase Auth provider configuration

### Integration Features

#### Example OAuth Integration
```javascript
integrations: {
  exampleOAuth: true, // Include OAuth example code
}
```

**What it includes**:
- Example OAuth flow implementation
- Token management patterns
- Webhook handling examples

#### File Upload
```javascript
integrations: {
  fileUpload: true, // Include file upload system
}
```

**What it includes**:
- Avatar upload functionality
- Supabase Storage integration
- File validation and processing

### Monitoring Features

#### Sentry Error Tracking
```javascript
monitoring: {
  sentry: true, // Enable Sentry error tracking
}
```

**Setup required**:
1. Sentry account and project
2. DSN and Auth Token
3. Environment variables

#### Vercel Analytics
```javascript
monitoring: {
  vercelAnalytics: true, // Enable Vercel Analytics
}
```

**Requirements**:
- Deployed on Vercel
- No additional setup needed

### Example Features

#### Chat Messages
```javascript
examples: {
  chatMessages: true, // Include chat example
}
```

**What it includes**:
- `chat_messages` database table
- Chat UI components
- Message handling API

#### AI Requests
```javascript
examples: {
  aiRequests: true, // Include AI example
}
```

**What it includes**:
- `ai_requests` database table
- AI integration patterns
- Request audit logging

## Database Customization

### Adding Custom Tables

1. **Create migration file**:
   ```bash
   supabase migration new add_custom_tables
   ```

2. **Add table definition**:
   ```sql
   -- Custom table example
   CREATE TABLE custom_items (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Add RLS policies**:
   ```sql
   ALTER TABLE custom_items ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view own items" ON custom_items
     FOR SELECT USING (user_id = auth.uid());
   
   CREATE POLICY "Users can insert own items" ON custom_items
     FOR INSERT WITH CHECK (user_id = auth.uid());
   ```

4. **Add indexes**:
   ```sql
   CREATE INDEX idx_custom_items_user_id ON custom_items(user_id);
   CREATE INDEX idx_custom_items_created_at ON custom_items(user_id, created_at DESC);
   ```

### Database Prefix

Use the `database.prefix` setting to namespace your tables:

```javascript
database: {
  prefix: "myapp", // Tables will be prefixed with "myapp_"
}
```

**Note**: This is currently informational. You'll need to manually prefix table names in migrations.

## API Customization

### Adding API Routes

1. **Create route file**:
   ```typescript
   // src/app/api/custom/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { createServerSupabaseClient } from '@/lib/supabase/server';
   
   export async function GET(request: NextRequest) {
     const supabase = await createServerSupabaseClient();
     
     // Your API logic here
     
     return NextResponse.json({ success: true });
   }
   ```

2. **Add authentication check**:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   
   if (!user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

3. **Add validation**:
   ```typescript
   import { z } from 'zod';
   
   const schema = z.object({
     name: z.string().min(1),
     description: z.string().optional(),
   });
   
   const body = await request.json();
   const validatedData = schema.parse(body);
   ```

### Webhook Handling

1. **Create webhook route**:
   ```typescript
   // src/app/api/webhooks/custom/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   
   export async function POST(request: NextRequest) {
     // Verify webhook signature
     const signature = request.headers.get('x-signature');
     // ... verification logic
     
     const payload = await request.json();
     
     // Process webhook
     
     return NextResponse.json({ received: true });
   }
   ```

## UI Customization

### Component Customization

1. **Modify existing components**:
   - Edit files in `src/components/`
   - Update styling with Tailwind classes
   - Add new props and functionality

2. **Create new components**:
   ```typescript
   // src/components/custom/my-component.tsx
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   
   interface MyComponentProps {
     title: string;
     children: React.ReactNode;
   }
   
   export function MyComponent({ title, children }: MyComponentProps) {
     return (
       <Card>
         <CardHeader>
           <CardTitle>{title}</CardTitle>
         </CardHeader>
         <CardContent>
           {children}
         </CardContent>
       </Card>
     );
   }
   ```

### Theme Customization

1. **Update Tailwind config**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: 'hsl(var(--primary))',
             foreground: 'hsl(var(--primary-foreground))',
           },
           // Add your custom colors
         },
       },
     },
   };
   ```

2. **Update CSS variables**:
   ```css
   /* src/app/globals.css */
   :root {
     --primary: 210 40% 50%;
     --primary-foreground: 0 0% 100%;
     /* Add your custom variables */
   }
   ```

### Layout Customization

1. **Modify protected layout**:
   ```typescript
   // src/app/(protected)/layout.tsx
   export default function ProtectedLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="min-h-screen bg-background">
         <Sidebar />
         <main className="flex-1 p-6">
           {children}
         </main>
       </div>
     );
   }
   ```

2. **Update sidebar**:
   ```typescript
   // src/components/layout/sidebar.tsx
   const navigation = [
     { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
     { name: 'Custom', href: '/custom', icon: CustomIcon },
     // Add your navigation items
   ];
   ```

## Page Customization

### Adding New Pages

1. **Create page file**:
   ```typescript
   // src/app/(protected)/custom/page.tsx
   import { requireAuth } from '@/lib/auth/session';
   
   export default async function CustomPage() {
     const user = await requireAuth();
     
     return (
       <div>
         <h1>Custom Page</h1>
         <p>Welcome, {user.full_name}!</p>
       </div>
     );
   }
   ```

2. **Add to navigation**:
   Update the sidebar component to include your new page.

### Modifying Existing Pages

1. **Dashboard page**:
   ```typescript
   // src/app/(protected)/dashboard/page.tsx
   export default async function DashboardPage() {
     const user = await requireAuth();
     
     return (
       <div className="space-y-6">
         <h1 className="text-3xl font-bold">Dashboard</h1>
         {/* Add your dashboard content */}
       </div>
     );
   }
   ```

## Cleanup and Optimization

### Removing Unused Features

1. **Run cleanup script**:
   ```bash
   pnpm cleanup:examples
   ```

2. **Manual cleanup**:
   - Remove unused API routes
   - Delete unused components
   - Clean up unused dependencies

### Performance Optimization

1. **Database optimization**:
   - Add indexes for your query patterns
   - Optimize RLS policies
   - Use database functions for complex operations

2. **Frontend optimization**:
   - Implement proper loading states
   - Add error boundaries
   - Optimize bundle size

## Deployment Customization

### Environment-Specific Configuration

1. **Development**:
   ```env
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   ```

2. **Production**:
   ```env
   # Vercel environment variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   ```

### Build Optimization

1. **Update build script**:
   ```json
   // package.json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

2. **Configure Next.js**:
   ```typescript
   // next.config.ts
   const nextConfig = {
     // Add your custom configuration
     experimental: {
       // Enable experimental features
     },
   };
   ```

## Best Practices

### Code Organization

1. **Keep components small and focused**
2. **Use TypeScript interfaces for props**
3. **Implement proper error handling**
4. **Add loading and error states**

### Database Design

1. **Always use RLS policies**
2. **Add proper indexes**
3. **Use foreign key constraints**
4. **Implement soft deletes when needed**

### Security

1. **Validate all inputs**
2. **Use proper authentication checks**
3. **Implement rate limiting**
4. **Sanitize user data**

### Performance

1. **Use database indexes**
2. **Implement caching strategies**
3. **Optimize images and assets**
4. **Monitor performance metrics**

---

**Need more help?** Check the [FEATURES.md](./FEATURES.md) for detailed feature documentation!
