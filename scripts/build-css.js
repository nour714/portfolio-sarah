/**
 * Plain-Node CSS Bundler & Asset Versioner
 * Concatenates modular stylesheets from style.css into css/main.css,
 * rewrites relative url() paths, and updates index.html with a content hash.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const STYLE_CSS = path.join(ROOT_DIR, 'style.css');
const MAIN_CSS = path.join(ROOT_DIR, 'css', 'main.css');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const CSS_DIR = path.join(ROOT_DIR, 'css');

function buildCss() {
    console.log('[build-css] Reading master stylesheet:', path.relative(ROOT_DIR, STYLE_CSS));
    const styleContent = fs.readFileSync(STYLE_CSS, 'utf8');

    // Parse @import rules: @import url("path") or @import "path";
    const importRegex = /@import\s+(?:url\(['"]?([^'"\)]+)['"]?\)|['"]([^'"]+)['"])\s*;/g;
    let match;
    const imports = [];

    while ((match = importRegex.exec(styleContent)) !== null) {
        const importPath = match[1] || match[2];
        if (importPath) {
            // Strip any query parameters (e.g. ?v=2.0)
            const cleanPath = importPath.split('?')[0].trim();
            imports.push(cleanPath);
        }
    }

    if (imports.length === 0) {
        console.error('[build-css] Error: No @import statements found in style.css');
        process.exit(1);
    }

    console.log(`[build-css] Found ${imports.length} stylesheets to bundle in order:`);

    const bundledChunks = [];
    bundledChunks.push(`/**\n * Bundled Master Stylesheet\n * Generated automatically by scripts/build-css.js\n * Do not edit directly; modify source files in css/\n */\n`);

    imports.forEach((relPath, index) => {
        const filePath = path.resolve(ROOT_DIR, relPath);
        if (!fs.existsSync(filePath)) {
            console.error(`[build-css] Error: File not found: ${relPath}`);
            process.exit(1);
        }

        console.log(`  ${index + 1}. ${relPath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const fileDir = path.dirname(filePath);

        // Rewrite relative url(...) targets so they resolve accurately from css/main.css
        const rewritten = fileContent.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g, (fullMatch, quote, targetUrl) => {
            const trimmed = targetUrl.trim();
            // Leave data URIs, anchors, protocols, or root paths untouched
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('data:') || trimmed.startsWith('http:') || trimmed.startsWith('https:') || trimmed.startsWith('//') || trimmed.startsWith('/')) {
                return fullMatch;
            }

            // Resolve target absolute path from source file directory
            const absTarget = path.resolve(fileDir, trimmed);
            // Compute relative path from target css directory (ROOT_DIR/css)
            let relativeFromMain = path.relative(CSS_DIR, absTarget).replace(/\\/g, '/');
            return `url(${quote}${relativeFromMain}${quote})`;
        });

        bundledChunks.push(`\n/* ========================================================= */`);
        bundledChunks.push(`/* Layer ${index + 1}: ${relPath} */`);
        bundledChunks.push(`/* ========================================================= */\n`);
        bundledChunks.push(rewritten);
    });

    const combinedCss = bundledChunks.join('\n');
    fs.writeFileSync(MAIN_CSS, combinedCss, 'utf8');

    const hash = crypto.createHash('sha256').update(combinedCss).digest('hex').slice(0, 8);
    const cssSizeKb = (Buffer.byteLength(combinedCss, 'utf8') / 1024).toFixed(1);
    console.log(`[build-css] Successfully generated ${path.relative(ROOT_DIR, MAIN_CSS)} (${cssSizeKb} KB, hash: ${hash})`);

    // Update index.html with the versioned bundle link
    if (fs.existsSync(INDEX_HTML)) {
        let indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');
        const linkPattern = /<link\s+rel=["']stylesheet["']\s+href=["'][^"']*(?:style\.css|css\/main\.css)[^"']*["']\s*>/i;

        if (linkPattern.test(indexHtml)) {
            indexHtml = indexHtml.replace(linkPattern, `<link rel="stylesheet" href="/css/main.css?v=${hash}">`);
            fs.writeFileSync(INDEX_HTML, indexHtml, 'utf8');
            console.log(`[build-css] Updated index.html with: <link rel="stylesheet" href="/css/main.css?v=${hash}">`);
        } else {
            console.warn('[build-css] Warning: Master stylesheet <link> tag not found in index.html to update.');
        }
    }
}

if (require.main === module) {
    buildCss();
}

module.exports = { buildCss };
