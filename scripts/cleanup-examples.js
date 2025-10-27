#!/usr/bin/env node

/**
 * Template Cleanup Script
 * Removes example code and unused features based on template.config.js
 */

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

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    log(`✅ Removed: ${filePath}`, 'green');
  }
}

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`✅ Removed directory: ${dirPath}`, 'green');
  }
}

function updateMigration(removeExamples) {
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/00_initial_schema.sql');
  
  if (!fs.existsSync(migrationPath)) {
    log(`⚠️  Migration file not found: ${migrationPath}`, 'yellow');
    return;
  }
  
  let content = fs.readFileSync(migrationPath, 'utf8');
  
  if (removeExamples) {
    // Remove example tables and their policies
    const exampleTableRegex = /-- Chat messages with AI assistant \(example pattern\)[\s\S]*?CREATE TABLE ai_requests[\s\S]*?\);[\s\S]*?(?=-- =============================================)/;
    content = content.replace(exampleTableRegex, '');
    
    // Remove example table RLS policies
    const examplePoliciesRegex = /-- Chat messages policies[\s\S]*?CREATE POLICY "Users can delete own ai requests" ON ai_requests[\s\S]*?FOR DELETE USING \(user_id = auth\.uid\(\)\);[\s\S]*?(?=-- =============================================)/;
    content = content.replace(examplePoliciesRegex, '');
    
    // Remove example table indexes
    const exampleIndexesRegex = /CREATE INDEX idx_chat_messages_user_id ON chat_messages\(user_id\);[\s\S]*?CREATE INDEX idx_chat_messages_created_at ON chat_messages\(user_id, created_at DESC\);[\s\S]*?(?=-- Provider lookups)/;
    content = content.replace(exampleIndexesRegex, '');
    
    // Remove example comments
    const exampleCommentsRegex = /COMMENT ON TABLE chat_messages IS 'Example: Conversation history with AI assistant';[\s\S]*?COMMENT ON COLUMN ai_requests\.latency_ms IS 'Response time in milliseconds';[\s\S]*?(?=-- =============================================)/;
    content = content.replace(exampleCommentsRegex, '');
    
    log('✅ Removed example tables from migration', 'green');
  }
  
  fs.writeFileSync(migrationPath, content);
}

function cleanupBasedOnConfig() {
  log('🧹 Cleaning up template based on configuration...', 'blue');
  
  // Read template config to determine what to remove
  const configPath = path.join(process.cwd(), 'template.config.js');
  
  if (!fs.existsSync(configPath)) {
    log('⚠️  template.config.js not found, skipping cleanup', 'yellow');
    return;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check if examples should be removed
  const removeExamples = !configContent.includes('chatMessages: true') && 
                        !configContent.includes('aiRequests: true');
  
  if (removeExamples) {
    log('📝 Removing example code...', 'cyan');
    
    // Remove example API routes
    removeDirectory('src/app/api/chat');
    removeDirectory('src/app/api/ai');
    
    // Remove example components
    removeDirectory('src/components/chat');
    removeDirectory('src/components/ai');
    
    // Remove example pages
    removeFile('src/app/(protected)/chat/page.tsx');
    
    // Update migration
    updateMigration(true);
    
    log('✅ Example code removed', 'green');
  }
  
  // Check if OAuth examples should be removed
  const removeOAuthExamples = !configContent.includes('exampleOAuth: true');
  
  if (removeOAuthExamples) {
    log('🔐 Removing OAuth example code...', 'cyan');
    
    removeDirectory('src/app/api/connections/example');
    removeDirectory('src/lib/example');
    
    log('✅ OAuth example code removed', 'green');
  }
  
  // Check if file upload should be removed
  const removeFileUpload = !configContent.includes('fileUpload: true');
  
  if (removeFileUpload) {
    log('📁 Removing file upload code...', 'cyan');
    
    removeDirectory('src/app/api/avatar');
    removeFile('src/components/settings/avatar-settings.tsx');
    
    // Remove storage bucket creation from migration
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/00_initial_schema.sql');
    if (fs.existsSync(migrationPath)) {
      let content = fs.readFileSync(migrationPath, 'utf8');
      
      // Remove storage bucket section
      const storageRegex = /-- =============================================[\s\S]*?-- STORAGE BUCKET FOR AVATARS[\s\S]*?CREATE POLICY "Users can delete own avatars" ON storage\.objects[\s\S]*?FOR DELETE USING \([\s\S]*?\);[\s\S]*?(?=-- =============================================)/;
      content = content.replace(storageRegex, '');
      
      fs.writeFileSync(migrationPath, content);
    }
    
    log('✅ File upload code removed', 'green');
  }
}

function showCleanupSummary() {
  log('\n🎉 Cleanup Complete!', 'green');
  log('====================', 'green');
  
  log('\n📋 What was cleaned up:', 'blue');
  log('- Removed unused example code', 'cyan');
  log('- Removed disabled features', 'cyan');
  log('- Updated database migration', 'cyan');
  log('- Cleaned up API routes', 'cyan');
  
  log('\n✅ Your template is now customized!', 'green');
  log('Run "pnpm dev" to start development', 'cyan');
}

function main() {
  try {
    cleanupBasedOnConfig();
    showCleanupSummary();
  } catch (error) {
    log(`\n❌ Cleanup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
