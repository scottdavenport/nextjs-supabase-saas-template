#!/bin/bash

# Coach AI - Development Server Restart Script
# This script kills any running dev servers and restarts them fresh

set -e  # Exit on any error

echo "🔄 Coach AI - Restarting Development Servers"
echo "============================================="

# Function to kill processes by port
kill_port() {
    local port=$1
    local process_name=$2
    
    echo "🔍 Checking for $process_name on port $port..."
    
    # Find PIDs using the port
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        echo "⚠️  Found $process_name processes on port $port: $pids"
        echo "🛑 Killing $process_name processes..."
        echo $pids | xargs kill -9 2>/dev/null || true
        sleep 1
        
        # Verify they're killed
        local remaining=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$remaining" ]; then
            echo "⚠️  Some processes still running, force killing..."
            echo $remaining | xargs kill -9 2>/dev/null || true
        fi
        echo "✅ $process_name processes killed"
    else
        echo "✅ No $process_name processes found on port $port"
    fi
}

# Function to kill processes by name
kill_process() {
    local process_name=$1
    local exact_match=${2:-false}
    
    echo "🔍 Checking for $process_name processes..."
    
    if [ "$exact_match" = "true" ]; then
        # Exact match
        local pids=$(pgrep -f "^$process_name" 2>/dev/null || true)
    else
        # Partial match
        local pids=$(pgrep -f "$process_name" 2>/dev/null || true)
    fi
    
    if [ -n "$pids" ]; then
        echo "⚠️  Found $process_name processes: $pids"
        echo "🛑 Killing $process_name processes..."
        echo $pids | xargs kill -9 2>/dev/null || true
        sleep 1
        echo "✅ $process_name processes killed"
    else
        echo "✅ No $process_name processes found"
    fi
}

# Kill common development servers
echo ""
echo "🧹 Cleaning up existing processes..."
echo "-----------------------------------"

# Kill Next.js dev server (port 3000)
kill_port 3000 "Next.js"

# Kill any other common dev ports
kill_port 3001 "Dev Server"
kill_port 8080 "Dev Server"
kill_port 8000 "Dev Server"

# Kill any remaining Node.js processes that might be dev servers
echo ""
echo "🔍 Checking for remaining Node.js processes..."
node_pids=$(pgrep -f "node.*dev\|node.*start\|next.*dev" 2>/dev/null || true)
if [ -n "$node_pids" ]; then
    echo "⚠️  Found remaining Node.js dev processes: $node_pids"
    echo "🛑 Killing remaining Node.js processes..."
    echo $node_pids | xargs kill -9 2>/dev/null || true
    sleep 1
    echo "✅ Remaining Node.js processes killed"
else
    echo "✅ No remaining Node.js dev processes found"
fi

# Kill any pnpm processes
kill_process "pnpm"

# Kill any npm processes
kill_process "npm"

# Kill any yarn processes
kill_process "yarn"

# Wait a moment for cleanup
echo ""
echo "⏳ Waiting for cleanup to complete..."
sleep 2

# Verify ports are free
echo ""
echo "🔍 Verifying ports are free..."
ports=(3000 3001 8080 8000)
for port in "${ports[@]}"; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "⚠️  Port $port is still in use!"
        echo "🛑 Force killing processes on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo "✅ Port $port is free"
    fi
done

# Clear any cached data
echo ""
echo "🧹 Clearing caches..."
echo "--------------------"

# Clear Next.js cache
if [ -d ".next" ]; then
    echo "🗑️  Clearing Next.js cache..."
    rm -rf .next
    echo "✅ Next.js cache cleared"
fi

# Clear node_modules/.cache if it exists
if [ -d "node_modules/.cache" ]; then
    echo "🗑️  Clearing node_modules cache..."
    rm -rf node_modules/.cache
    echo "✅ node_modules cache cleared"
fi

# Clear any lock files that might cause issues
if [ -f "pnpm-lock.yaml" ]; then
    echo "🔍 Checking pnpm lock file..."
    echo "✅ pnpm-lock.yaml exists"
fi

# Install dependencies if needed
echo ""
echo "📦 Checking dependencies..."
echo "---------------------------"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.pnpm/registry.npmjs.org" ]; then
    echo "📥 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies are up to date"
fi

# Start the development server
echo ""
echo "🚀 Starting development server..."
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Start the dev server in the background
echo "🎯 Starting Next.js development server on http://localhost:3000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Start the server and capture its PID
pnpm dev &
DEV_PID=$!

# Function to handle cleanup on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development server..."
    kill $DEV_PID 2>/dev/null || true
    wait $DEV_PID 2>/dev/null || true
    echo "✅ Development server stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for the server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if the server is running
if kill -0 $DEV_PID 2>/dev/null; then
    echo "✅ Development server started successfully!"
    echo "🌐 Open http://localhost:3000 in your browser"
    echo ""
    echo "📊 Server Status:"
    echo "   PID: $DEV_PID"
    echo "   URL: http://localhost:3000"
    echo "   Status: Running"
    echo ""
    echo "💡 Tips:"
    echo "   - Press Ctrl+C to stop the server"
    echo "   - Check the terminal for any errors"
    echo "   - The server will auto-reload on file changes"
    echo ""
    
    # Wait for the process to finish
    wait $DEV_PID
else
    echo "❌ Failed to start development server"
    exit 1
fi
