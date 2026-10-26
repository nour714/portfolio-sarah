/**
 * CSS Bundler for Sarah Nabil Portfolio
 * Eliminates @import waterfall for ultra-fast First Contentful Paint (FCP)
 * Run with: node scripts/bundle-css.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const CSS_FILES = [
    "css/vendor/lenis.min.css",
    "css/base/variables.css",
    "css/base/reset.css",
    "css/components/header.css",
    "css/components/hero.css",
    "css/components/hero-video.css",
    "css/components/about.css",
    "css/components/skills.css",
    "css/components/projects.css",
    "css/components/certificates.css",
    "css/components/experience.css",
    "css/components/contact.css",
    "css/components/modal.css",
    "css/components/toast.css",
    "css/features/animations.css"
];

const bundleParts = [
    `/**\n * Sarah Nabil Portfolio - Unified Production Stylesheet\n * Bundled for Zero-Waterfall Instant Loading & 60fps Performance\n * Generated: ${new Date().toISOString()}\n */\n`
];

for (const relPath of CSS_FILES) {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: ${relPath} not found!`);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Normalize relative paths like ../../images/ or ../images/ to images/
    content = content.replace(/\.\.\/\.\.\/images\//g, 'images/');
    content = content.replace(/\.\.\/images\//g, 'images/');

    bundleParts.push(`\n/* ==========================================================\n * MODULE: ${relPath}\n * ========================================================== */\n${content}`);
}

const bundledCss = bundleParts.join('\n');
const outputPath = path.join(ROOT_DIR, 'style.css');

fs.writeFileSync(outputPath, bundledCss, 'utf8');
console.log(`[CSS Bundler] Generated ${outputPath} (${(bundledCss.length / 1024).toFixed(1)} KB) with 0 @imports.`);
