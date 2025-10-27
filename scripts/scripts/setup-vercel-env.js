#!/usr/bin/env node

/**
 * Coach AI - Vercel Environment Variables Setup Script
 * This script helps set up environment variables in Vercel for different environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'OPENROUTER_API_KEY',
  'WHOOP_WEBHOOK_SECRET',
  'STRAVA_CLIENT_ID',
  'STRAVA_CLIENT_SECRET',
  'STRAVA_WEBHOOK_SECRET',
  'INNGEST_SIGNING_KEY'
];

// Environment variable descriptions
const ENV_VAR_DESCRIPTIONS = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL (e.g., https://your-project.supabase.co)',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY': 'Supabase anon/public key',
  'SUPABASE_SECRET_KEY': 'Supabase service role key (server-side only)',
  'OPENROUTER_API_KEY': 'OpenRouter API key for AI chat functionality',
  'WHOOP_WEBHOOK_SECRET': 'WHOOP webhook verification secret',
  'STRAVA_CLIENT_ID': 'Strava OAuth client ID',
  'STRAVA_CLIENT_SECRET': 'Strava OAuth client secret',
  'STRAVA_WEBHOOK_SECRET': 'Strava webhook verification secret',
  'INNGEST_SIGNING_KEY': 'Inngest signing key for background jobs'
};

function checkVercelCLI() {
  try {
    const { stdout } = execCommand('vercel --version');
    log(`✅ Vercel CLI installed: ${stdout.trim()}`, 'green');
    return true;
  } catch (error) {
    log('❌ Vercel CLI not found. Please install it first:', 'red');
    log('  npm install -g vercel@latest', 'yellow');
    return false;
  }
}

function checkVercelAuth() {
  try {
    execCommand('vercel whoami');
    log('✅ Logged in to Vercel', 'green');
    return true;
  } catch (error) {
    log('❌ Not logged in to Vercel. Please run:', 'red');
    log('  vercel login', 'yellow');
    return false;
  }
}

function checkProjectLinked() {
  try {
    const { stdout } = execCommand('vercel ls --yes', { ignoreError: true });
    if (stdout.includes('coach-ai') || stdout.includes('coach')) {
      log('✅ Vercel project is linked', 'green');
      return true;
    } else {
      log('❌ Vercel project not linked. Please run:', 'red');
      log('  vercel link', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Error checking Vercel project status', 'red');
    return false;
  }
}

function loadLocalEnvVars() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local file not found', 'red');
    log('Please create .env.local with your environment variables first', 'yellow');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  log(`✅ Loaded ${Object.keys(envVars).length} environment variables from .env.local`, 'green');
  return envVars;
}

function checkEnvVars(envVars) {
  const missing = [];
  const present = [];
  
  REQUIRED_ENV_VARS.forEach(varName => {
    if (envVars[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  if (present.length > 0) {
    log(`✅ Found ${present.length} environment variables:`, 'green');
    present.forEach(varName => {
      log(`  - ${varName}`, 'cyan');
    });
  }
  
  if (missing.length > 0) {
    log(`❌ Missing ${missing.length} environment variables:`, 'red');
    missing.forEach(varName => {
      log(`  - ${varName}: ${ENV_VAR_DESCRIPTIONS[varName]}`, 'yellow');
    });
  }
  
  return { missing, present };
}

function showVercelEnvSetup() {
  log('\n📋 Manual Vercel Environment Variables Setup:', 'bright');
  log('===============================================', 'bright');
  
  log('\n1. Go to your Vercel dashboard:', 'blue');
  log('   https://vercel.com/dashboard', 'cyan');
  
  log('\n2. Select your "coach-ai" project', 'blue');
  
  log('\n3. Go to Settings → Environment Variables', 'blue');
  
  log('\n4. Add the following variables:', 'blue');
  
  REQUIRED_ENV_VARS.forEach(varName => {
    log(`\n   Variable: ${varName}`, 'yellow');
    log(`   Description: ${ENV_VAR_DESCRIPTIONS[varName]}`, 'cyan');
    log(`   Environment: Production, Preview, Development`, 'green');
  });
  
  log('\n5. Click "Save" after adding each variable', 'blue');
  
  log('\n6. Redeploy your project to apply the changes:', 'blue');
  log('   vercel --prod', 'cyan');
}

function showSupabaseBranchingSetup() {
  log('\n🌿 Supabase Branching Setup (Optional):', 'bright');
  log('=========================================', 'bright');
  
  log('\nFor true preview environment isolation:', 'blue');
  
  log('\n1. Create a Supabase branch for your feature:', 'yellow');
  log('   ./scripts/setup-supabase-branch.sh create feat/your-feature', 'cyan');
  
  log('\n2. Get the branch URL and keys:', 'yellow');
  log('   supabase branches list', 'cyan');
  
  log('\n3. Update Vercel environment variables for Preview environment:', 'yellow');
  log('   - Use the branch URL instead of production URL', 'cyan');
  log('   - Use branch-specific keys', 'cyan');
  
  log('\n4. Deploy to preview:', 'yellow');
  log('   vercel', 'cyan');
}

function main() {
  log('🚀 Coach AI - Vercel Environment Setup', 'bright');
  log('=====================================', 'bright');
  
  // Check prerequisites
  if (!checkVercelCLI()) {
    process.exit(1);
  }
  
  if (!checkVercelAuth()) {
    process.exit(1);
  }
  
  if (!checkProjectLinked()) {
    process.exit(1);
  }
  
  // Load local environment variables
  const localEnvVars = loadLocalEnvVars();
  
  // Check which environment variables are present
  const { missing, present } = checkEnvVars(localEnvVars);
  
  if (missing.length === 0) {
    log('\n✅ All required environment variables are present in .env.local', 'green');
  } else {
    log(`\n⚠️  ${missing.length} environment variables are missing from .env.local`, 'yellow');
    log('Please add them before setting up Vercel environment variables', 'yellow');
  }
  
  // Show setup instructions
  showVercelEnvSetup();
  
  if (present.length > 0) {
    log('\n💡 Pro Tip: You can copy values from .env.local to Vercel dashboard', 'blue');
  }
  
  // Show Supabase branching option
  showSupabaseBranchingSetup();
  
  log('\n🎉 Setup complete! Follow the instructions above to configure Vercel.', 'green');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
