#!/usr/bin/env node

/**
 * Coach AI - Development Server Restart Script
 * Cross-platform script to kill dev servers and restart them
 */

const { spawn, exec } = require('child_process');
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
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error && !options.ignoreError) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function killProcessesOnPort(port) {
  try {
    log(`🔍 Checking for processes on port ${port}...`, 'cyan');
    
    // Find processes using the port
    const { stdout } = await execCommand(`lsof -ti:${port}`, { ignoreError: true });
    
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      log(`⚠️  Found processes on port ${port}: ${pids.join(', ')}`, 'yellow');
      
      // Kill the processes
      for (const pid of pids) {
        try {
          await execCommand(`kill -9 ${pid}`, { ignoreError: true });
          log(`🛑 Killed process ${pid}`, 'red');
        } catch (error) {
          log(`⚠️  Could not kill process ${pid}: ${error.message}`, 'yellow');
        }
      }
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify they're killed
      const { stdout: remaining } = await execCommand(`lsof -ti:${port}`, { ignoreError: true });
      if (remaining.trim()) {
        log(`⚠️  Some processes still running on port ${port}`, 'yellow');
      } else {
        log(`✅ All processes killed on port ${port}`, 'green');
      }
    } else {
      log(`✅ No processes found on port ${port}`, 'green');
    }
  } catch (error) {
    log(`⚠️  Error checking port ${port}: ${error.message}`, 'yellow');
  }
}

async function killProcessesByName(processName) {
  try {
    log(`🔍 Checking for ${processName} processes...`, 'cyan');
    
    const { stdout } = await execCommand(`pgrep -f "${processName}"`, { ignoreError: true });
    
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      log(`⚠️  Found ${processName} processes: ${pids.join(', ')}`, 'yellow');
      
      for (const pid of pids) {
        try {
          await execCommand(`kill -9 ${pid}`, { ignoreError: true });
          log(`🛑 Killed ${processName} process ${pid}`, 'red');
        } catch (error) {
          log(`⚠️  Could not kill ${processName} process ${pid}: ${error.message}`, 'yellow');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      log(`✅ ${processName} processes killed`, 'green');
    } else {
      log(`✅ No ${processName} processes found`, 'green');
    }
  } catch (error) {
    log(`⚠️  Error checking ${processName} processes: ${error.message}`, 'yellow');
  }
}

async function clearCaches() {
  log('🧹 Clearing caches...', 'cyan');
  log('--------------------', 'cyan');
  
  // Clear Next.js cache
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    log('🗑️  Clearing Next.js cache...', 'yellow');
    await execCommand(`rm -rf "${nextDir}"`, { ignoreError: true });
    log('✅ Next.js cache cleared', 'green');
  }
  
  // Clear node_modules/.cache
  const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    log('🗑️  Clearing node_modules cache...', 'yellow');
    await execCommand(`rm -rf "${cacheDir}"`, { ignoreError: true });
    log('✅ node_modules cache cleared', 'green');
  }
}

async function checkDependencies() {
  log('📦 Checking dependencies...', 'cyan');
  log('---------------------------', 'cyan');
  
  const nodeModulesDir = path.join(process.cwd(), 'node_modules');
  const pnpmLockFile = path.join(process.cwd(), 'pnpm-lock.yaml');
  
  if (!fs.existsSync(nodeModulesDir) || !fs.existsSync(pnpmLockFile)) {
    log('📥 Installing dependencies...', 'yellow');
    try {
      await execCommand('pnpm install', { cwd: process.cwd() });
      log('✅ Dependencies installed', 'green');
    } catch (error) {
      log(`❌ Failed to install dependencies: ${error.message}`, 'red');
      throw error;
    }
  } else {
    log('✅ Dependencies are up to date', 'green');
  }
}

function startDevServer() {
  log('🚀 Starting development server...', 'cyan');
  log('=================================', 'cyan');
  
  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Error: package.json not found. Are you in the right directory?', 'red');
    process.exit(1);
  }
  
  log('🎯 Starting Next.js development server on http://localhost:3000', 'green');
  log('📝 Press Ctrl+C to stop the server', 'blue');
  log('');
  
  // Start the dev server
  const devProcess = spawn('pnpm', ['dev'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });
  
  // Handle cleanup on exit
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down development server...', 'yellow');
    devProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 Shutting down development server...', 'yellow');
    devProcess.kill('SIGTERM');
    process.exit(0);
  });
  
  // Wait for the process to finish
  devProcess.on('close', (code) => {
    if (code !== 0) {
      log(`❌ Development server exited with code ${code}`, 'red');
      process.exit(code);
    }
  });
}

async function main() {
  try {
    log('🔄 Coach AI - Restarting Development Servers', 'bright');
    log('=============================================', 'bright');
    
    // Kill processes on common dev ports
    const ports = [3000, 3001, 8080, 8000];
    for (const port of ports) {
      await killProcessesOnPort(port);
    }
    
    // Kill common dev processes
    const processes = ['pnpm', 'npm', 'yarn', 'node.*dev', 'next.*dev'];
    for (const process of processes) {
      await killProcessesByName(process);
    }
    
    // Wait for cleanup
    log('⏳ Waiting for cleanup to complete...', 'cyan');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear caches
    await clearCaches();
    
    // Check dependencies
    await checkDependencies();
    
    // Start the dev server
    startDevServer();
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
