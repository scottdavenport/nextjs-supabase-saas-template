# Development Scripts

This directory contains utility scripts for managing the development environment.

## Available Scripts

### `dev-restart.js` (Recommended)
Cross-platform Node.js script that kills all dev servers and restarts them fresh.

**Usage:**
```bash
# Using npm/pnpm script (recommended)
pnpm run dev:restart

# Or run directly
node scripts/dev-restart.js
```

**Features:**
- ✅ Kills processes on ports 3000, 3001, 8080, 8000
- ✅ Kills pnpm, npm, yarn, and Node.js dev processes
- ✅ Clears Next.js cache (.next directory)
- ✅ Clears node_modules cache
- ✅ Installs dependencies if needed
- ✅ Starts fresh development server
- ✅ Cross-platform (works on macOS, Linux, Windows)
- ✅ Colored console output
- ✅ Graceful shutdown with Ctrl+C

### `dev-restart.sh` (Bash)
Bash script with the same functionality as the Node.js version.

**Usage:**
```bash
# Using npm/pnpm script
pnpm run dev:restart:bash

# Or run directly
./scripts/dev-restart.sh
```

**Features:**
- ✅ Same functionality as Node.js version
- ✅ More detailed process management
- ✅ Better error handling
- ⚠️  Requires bash (macOS/Linux only)

## Package.json Scripts

The following scripts are available in `package.json`:

```json
{
  "dev": "next dev --webpack",                    // Start dev server normally
  "dev:restart": "node scripts/dev-restart.js",   // Clean restart (recommended)
  "dev:restart:bash": "./scripts/dev-restart.sh", // Clean restart (bash)
  "dev:clean": "rm -rf .next && pnpm dev"         // Simple cache clear + restart
}
```

## When to Use

Use `dev:restart` when you:
- Have multiple dev servers running
- Want to clear all caches
- Are experiencing weird build issues
- Want to start completely fresh
- Have port conflicts

Use `dev:clean` when you:
- Just want to clear Next.js cache
- Don't have multiple processes running
- Want a quick restart

## Troubleshooting

### Port Still in Use
If you get "port already in use" errors:
```bash
# Kill all processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or use the restart script
pnpm run dev:restart
```

### Permission Denied
If you get permission errors on the bash script:
```bash
chmod +x scripts/dev-restart.sh
```

### Node.js Script Issues
If the Node.js script fails:
```bash
# Make sure it's executable
chmod +x scripts/dev-restart.js

# Run with node directly
node scripts/dev-restart.js
```

## Development Workflow

1. **Start development:**
   ```bash
   pnpm run dev:restart
   ```

2. **Make changes** to your code

3. **If you encounter issues:**
   ```bash
   pnpm run dev:restart
   ```

4. **Stop development:**
   Press `Ctrl+C` in the terminal

The scripts will automatically handle cleanup when you stop the development server.
