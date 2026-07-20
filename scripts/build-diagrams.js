#!/usr/bin/env node

/**
 * PlantUML Diagram Builder (Node.js variant)
 * Converts .puml files to SVG using plantuml-builder or exec
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIAGRAMS_DIR = path.join(PROJECT_ROOT, 'diagrams');
const OUTPUT_DIR = path.join(DIAGRAMS_DIR, 'build');

console.log('📊 Building PlantUML Diagrams (Node.js)...');
console.log(`Project Root: ${PROJECT_ROOT}`);
console.log(`Diagrams Directory: ${DIAGRAMS_DIR}`);
console.log(`Output Directory: ${OUTPUT_DIR}`);
console.log('');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
}

// Get all .puml files
const pumlFiles = fs.readdirSync(DIAGRAMS_DIR).filter(f => f.endsWith('.puml'));

if (pumlFiles.length === 0) {
    console.log('❌ No .puml files found in diagrams directory');
    process.exit(1);
}

console.log(`🔄 Found ${pumlFiles.length} diagram(s) to convert...\n`);

// Convert each diagram
let successCount = 0;
let errorCount = 0;

pumlFiles.forEach(pumlFile => {
    const inputPath = path.join(DIAGRAMS_DIR, pumlFile);
    const filename = path.basename(pumlFile, '.puml');
    const outputPath = path.join(OUTPUT_DIR, `${filename}.svg`);
    
    try {
        console.log(`  🔨 Processing: ${pumlFile}`);
        
        // Try to use plantuml command
        try {
            execSync(`plantuml -tsvg -o "${OUTPUT_DIR}" "${inputPath}"`, {
                stdio: 'pipe'
            });
            
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                console.log(`  ✅ Generated: ${filename}.svg (${(stats.size / 1024).toFixed(2)} KB)`);
                successCount++;
            } else {
                console.log(`  ⚠️  PlantUML command executed but file not created`);
                errorCount++;
            }
        } catch (e) {
            if (e.message.includes('ENOENT')) {
                console.log(`  ❌ PlantUML CLI not found. Install with: npm install -g @jgraph/plantuml`);
            } else {
                console.log(`  ❌ Error: ${e.message}`);
            }
            errorCount++;
        }
    } catch (error) {
        console.error(`  ❌ Failed to process ${pumlFile}:`, error.message);
        errorCount++;
    }
});

console.log('');
console.log('=' .repeat(50));
console.log(`✅ Build Complete: ${successCount} success, ${errorCount} failed`);
console.log('=' .repeat(50));

if (fs.existsSync(OUTPUT_DIR)) {
    const svgFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.svg'));
    if (svgFiles.length > 0) {
        console.log(`\n📁 Generated SVGs in ${OUTPUT_DIR}:`);
        svgFiles.forEach(f => {
            const fullPath = path.join(OUTPUT_DIR, f);
            const stats = fs.statSync(fullPath);
            console.log(`  • ${f} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
    }
}

console.log('\n💡 Next steps:');
console.log(`  1. Review generated SVGs in diagrams/build/`);
console.log(`  2. Embed SVGs in documentation (FLOW_VISUALIZATION.md)`);
console.log(`  3. Commit .puml source files to version control`);

process.exit(errorCount > 0 ? 1 : 0);
