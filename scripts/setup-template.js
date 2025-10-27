#!/usr/bin/env node

/**
 * Next.js + Supabase SaaS Template Setup Script
 * Interactive setup for customizing the template
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    const stdout = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
    return { stdout, stderr: '' };
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
    return { stdout: '', stderr: error.message };
  }
}

// Simple prompt function (no external dependencies)
function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getAppInfo() {
  log('\n🚀 Next.js + Supabase SaaS Template Setup', 'bright');
  log('==========================================', 'bright');
  
  log('\nLet\'s customize your template:', 'blue');
  
  const appName = await prompt('App name (kebab-case): ');
  const appDescription = await prompt('App description: ');
  const authorName = await prompt('Author name: ');
  const databasePrefix = await prompt('Database table prefix (optional): ') || '';
  
  return {
    appName: appName || 'my-saas-app',
    appDescription: appDescription || 'A Next.js SaaS application',
    authorName: authorName || 'Developer',
    databasePrefix: databasePrefix || ''
  };
}

async function getFeatureChoices() {
  log('\n📋 Feature Selection:', 'blue');
  log('Choose which features to include:', 'cyan');
  
  const features = {
    auth: {
      emailPassword: true, // Always include
      googleOAuth: await prompt('Include Google OAuth? (y/N): ').then(a => a.toLowerCase() === 'y'),
      appleOAuth: await prompt('Include Apple OAuth? (y/N): ').then(a => a.toLowerCase() === 'y'),
    },
    integrations: {
      exampleOAuth: await prompt('Include example OAuth integration? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
      fileUpload: await prompt('Include file upload (avatars)? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
    },
    monitoring: {
      sentry: await prompt('Include Sentry error monitoring? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
      vercelAnalytics: await prompt('Include Vercel Analytics? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
    },
    examples: {
      chatMessages: await prompt('Include example chat messages table? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
      aiRequests: await prompt('Include example AI requests table? (Y/n): ').then(a => a.toLowerCase() !== 'n'),
      externalAccounts: true, // Always include
    }
  };
  
  return features;
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    log(`⚠️  File not found: ${filePath}`, 'yellow');
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
    content = content.replace(regex, value);
  });
  
  fs.writeFileSync(filePath, content);
}

function updatePackageJson(appInfo) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  replaceInFile(packageJsonPath, {
    '{{APP_NAME}}': appInfo.appName,
    '{{APP_DESCRIPTION}}': appInfo.appDescription,
    '{{AUTHOR_NAME}}': appInfo.authorName
  });
  
  log('✅ Updated package.json', 'green');
}

function updateTemplateConfig(appInfo, features) {
  const configPath = path.join(process.cwd(), 'template.config.js');
  
  const configContent = `// Template Configuration
// This file defines feature flags and customization options for the template

export interface TemplateConfig {
  app: {
    name: string;
    description: string;
    author: string;
  };
  features: {
    auth: {
      emailPassword: boolean;
      googleOAuth: boolean;
      appleOAuth: boolean;
    };
    integrations: {
      exampleOAuth: boolean;
      fileUpload: boolean;
    };
    monitoring: {
      sentry: boolean;
      vercelAnalytics: boolean;
    };
    examples: {
      chatMessages: boolean;
      aiRequests: boolean;
      externalAccounts: boolean;
    };
  };
  database: {
    prefix: string;
  };
}

export const defaultConfig: TemplateConfig = {
  app: {
    name: "${appInfo.appName}",
    description: "${appInfo.appDescription}",
    author: "${appInfo.authorName}",
  },
  features: {
    auth: {
      emailPassword: true,
      googleOAuth: ${features.auth.googleOAuth},
      appleOAuth: ${features.auth.appleOAuth},
    },
    integrations: {
      exampleOAuth: ${features.integrations.exampleOAuth},
      fileUpload: ${features.integrations.fileUpload},
    },
    monitoring: {
      sentry: ${features.monitoring.sentry},
      vercelAnalytics: ${features.monitoring.vercelAnalytics},
    },
    examples: {
      chatMessages: ${features.examples.chatMessages},
      aiRequests: ${features.examples.aiRequests},
      externalAccounts: true,
    },
  },
  database: {
    prefix: "${appInfo.databasePrefix}",
  },
};

// Helper functions for template customization
export function getConfig(): TemplateConfig {
  return defaultConfig;
}

export function hasFeature(feature: keyof TemplateConfig['features']): boolean {
  return Object.values(defaultConfig.features[feature]).some(Boolean);
}

export function getAppName(): string {
  return defaultConfig.app.name;
}

export function getDatabasePrefix(): string {
  return defaultConfig.database.prefix;
}`;

  fs.writeFileSync(configPath, configContent);
  log('✅ Updated template.config.js', 'green');
}

function updateEnvExample(features) {
  const envPath = path.join(process.cwd(), 'env.example');
  let envContent = `# Next.js + Supabase SaaS Template Environment Variables
# Copy this file to .env.local and fill in your values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Optional: Sentry Error Monitoring
${features.monitoring.sentry ? 'SENTRY_AUTH_TOKEN=' : '# SENTRY_AUTH_TOKEN='}

# Optional: External OAuth Providers
${features.auth.googleOAuth ? '# Google OAuth\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=' : '# Google OAuth (disabled)\n# GOOGLE_CLIENT_ID=\n# GOOGLE_CLIENT_SECRET='}

${features.auth.appleOAuth ? '# Apple OAuth\nAPPLE_CLIENT_ID=\nAPPLE_CLIENT_SECRET=' : '# Apple OAuth (disabled)\n# APPLE_CLIENT_ID=\n# APPLE_CLIENT_SECRET='}

# Optional: Example Integration (remove if not needed)
${features.integrations.exampleOAuth ? '# Example OAuth Provider\nEXAMPLE_CLIENT_ID=\nEXAMPLE_CLIENT_SECRET=\nEXAMPLE_WEBHOOK_SECRET=' : '# Example OAuth Provider (disabled)\n# EXAMPLE_CLIENT_ID=\n# EXAMPLE_CLIENT_SECRET=\n# EXAMPLE_WEBHOOK_SECRET='}

# Optional: Background Jobs
INNGEST_SIGNING_KEY=

# Optional: AI Integration
OPENROUTER_API_KEY=`;

  fs.writeFileSync(envPath, envContent);
  log('✅ Updated env.example', 'green');
}

function showNextSteps(appInfo, features) {
  log('\n🎉 Template Setup Complete!', 'green');
  log('=============================', 'green');
  
  log('\n📋 Next Steps:', 'blue');
  log('1. Install dependencies:', 'cyan');
  log('   pnpm install', 'yellow');
  
  log('\n2. Set up environment variables:', 'cyan');
  log('   cp env.example .env.local', 'yellow');
  log('   # Edit .env.local with your values', 'yellow');
  
  log('\n3. Set up Supabase:', 'cyan');
  log('   supabase login', 'yellow');
  log('   supabase init', 'yellow');
  log('   supabase start', 'yellow');
  
  log('\n4. Run database migrations:', 'cyan');
  log('   supabase db reset', 'yellow');
  
  log('\n5. Start development server:', 'cyan');
  log('   pnpm dev', 'yellow');
  
  log('\n📚 Documentation:', 'blue');
  log('- README.md - Quick start guide', 'cyan');
  log('- SETUP.md - Detailed setup instructions', 'cyan');
  log('- TEMPLATE.md - Customization guide', 'cyan');
  
  log('\n🔧 Customization:', 'blue');
  log('- Edit template.config.js to modify features', 'cyan');
  log('- Add your tables to supabase/migrations/', 'cyan');
  log('- Customize components in src/components/', 'cyan');
  
  log('\n🚀 Deployment:', 'blue');
  log('- Deploy to Vercel: vercel --prod', 'cyan');
  log('- Set up environment variables in Vercel dashboard', 'cyan');
  log('- Run: pnpm setup:vercel', 'cyan');
}

async function main() {
  try {
    const appInfo = await getAppInfo();
    const features = await getFeatureChoices();
    
    log('\n⚙️  Configuring template...', 'blue');
    
    updatePackageJson(appInfo);
    updateTemplateConfig(appInfo, features);
    updateEnvExample(features);
    
    showNextSteps(appInfo, features);
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
