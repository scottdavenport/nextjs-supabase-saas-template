#!/usr/bin/env node

// Suppress Node.js deprecation warnings
process.removeAllListeners('warning');

// Start Next.js dev server
const { spawn } = require('child_process');

const child = spawn('npx', ['next', 'dev', '--webpack'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation'
  }
});

child.on('close', (code) => {
  process.exit(code);
});
