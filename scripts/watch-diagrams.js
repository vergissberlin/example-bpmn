#!/usr/bin/env node

/**
 * PlantUML File Watcher with Auto-Build
 * Watches diagrams directory and rebuilds SVGs on file changes
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIAGRAMS_DIR = path.join(PROJECT_ROOT, 'diagrams');
const WATCH_PATTERN = path.join(DIAGRAMS_DIR, '*.puml');

console.log('📊 PlantUML Diagram File Watcher');
console.log(`Project Root: ${PROJECT_ROOT}`);
console.log(`Watching: ${WATCH_PATTERN}`);
console.log('');

// Build diagrams
function buildDiagrams() {
    return new Promise((resolve, reject) => {
        console.log(`⏰ ${new Date().toLocaleTimeString()} - Building diagrams...`);
        
        const child = spawn('node', ['scripts/build-diagrams.js'], {
            cwd: PROJECT_ROOT,
            stdio: 'inherit'
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${new Date().toLocaleTimeString()} - Build completed successfully\n`);
                resolve();
            } else {
                console.error(`❌ ${new Date().toLocaleTimeString()} - Build failed (exit code: ${code})\n`);
                reject(new Error(`Build failed with code ${code}`));
            }
        });
        
        child.on('error', (err) => {
            console.error(`❌ Error starting build: ${err.message}\n`);
            reject(err);
        });
    });
}

// Initialize watcher
const watcher = chokidar.watch(WATCH_PATTERN, {
    persistent: true,
    ignored: /node_modules|\.git/,
    awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
    }
});

let isBuilding = false;
let pendingBuild = false;

watcher.on('ready', () => {
    console.log('👀 Watcher ready. Watching for file changes...\n');
});

watcher.on('change', async (filepath) => {
    const filename = path.basename(filepath);
    console.log(`📝 Changed: ${filename}`);
    
    if (isBuilding) {
        console.log('   (Build in progress, will rebuild after completion)');
        pendingBuild = true;
        return;
    }
    
    isBuilding = true;
    try {
        await buildDiagrams();
    } catch (err) {
        console.error(`Build error: ${err.message}`);
    } finally {
        isBuilding = false;
        
        if (pendingBuild) {
            pendingBuild = false;
            console.log('🔄 Running queued build...\n');
            // Trigger another build
            const event = new Event('change');
            watcher.emit('change', filepath);
        }
    }
});

watcher.on('add', (filepath) => {
    const filename = path.basename(filepath);
    console.log(`✨ Added: ${filename}`);
    console.log('   (New file detected, triggering build)\n');
    watcher.emit('change', filepath);
});

watcher.on('unlink', (filepath) => {
    const filename = path.basename(filepath);
    console.log(`🗑️  Deleted: ${filename}\n`);
});

watcher.on('error', (error) => {
    console.error(`❌ Watcher error: ${error.message}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down watcher...');
    watcher.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down watcher...');
    watcher.close();
    process.exit(0);
});
