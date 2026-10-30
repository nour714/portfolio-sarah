/**
 * Automated Verification Script (Task 9)
 * Checks:
 * 1. Syntax of all JavaScript files (node --check)
 * 2. Missing referenced files (src, href, url)
 * 3. Duplicate DOM IDs in HTML
 * 4. Broken anchor navigation (#id)
 * 5. Images missing alt, width, or height
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

function logError(msg) {
    console.error(`❌ [ERROR] ${msg}`);
    errors++;
}

function logWarn(msg) {
    console.warn(`⚠️  [WARN] ${msg}`);
    warnings++;
}

function logSuccess(msg) {
    console.log(`✅ [OK] ${msg}`);
}

console.log('🔍 Starting Integrity and Quality Audit...\n');

// 1. Check all JS files syntax
console.log('--- Step 1: Checking JavaScript Syntax (node --check) ---');
function checkJsDir(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, f.name);
        if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.git') {
            checkJsDir(full);
        } else if (f.isFile() && f.name.endsWith('.js')) {
            try {
                cp.execSync(`node --check "${full}"`, { stdio: 'pipe' });
            } catch (err) {
                logError(`Syntax error in: ${path.relative(ROOT_DIR, full)}`);
            }
        }
    }
}
checkJsDir(path.join(ROOT_DIR, 'js'));
checkJsDir(path.join(ROOT_DIR, 'scripts'));
if (errors === 0) logSuccess('All JS files passed node --check');

// 2. Parse HTML files for IDs, Anchors, Imgs, and References
const htmlFiles = ['index.html', 'cv.html'];

htmlFiles.forEach((file) => {
    const htmlPath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(htmlPath)) return;
    const content = fs.readFileSync(htmlPath, 'utf8');

    console.log(`\n--- Step 2: Auditing DOM in ${file} ---`);

    // A. Duplicate IDs
    const idRegex = /\sid=["']([^"']+)["']/g;
    const seenIds = new Set();
    const duplicateIds = new Set();
    let m;
    while ((m = idRegex.exec(content)) !== null) {
        const id = m[1];
        if (seenIds.has(id)) {
            duplicateIds.add(id);
        }
        seenIds.add(id);
    }
    if (duplicateIds.size > 0) {
        duplicateIds.forEach(id => logError(`${file}: Duplicate ID found: #${id}`));
    } else {
        logSuccess(`${file}: Zero duplicate IDs found (${seenIds.size} unique IDs verified)`);
    }

    // B. Broken Anchor Links
    const anchorRegex = /<a[^>]+href=["']#([^"']+)["']/g;
    const anchors = [];
    while ((m = anchorRegex.exec(content)) !== null) {
        anchors.push(m[1]);
    }
    let brokenAnchors = 0;
    anchors.forEach((anchor) => {
        if (!seenIds.has(anchor)) {
            logError(`${file}: Broken anchor link href="#${anchor}" (Target ID not in DOM)`);
            brokenAnchors++;
        }
    });
    if (brokenAnchors === 0) {
        logSuccess(`${file}: All ${anchors.length} anchor links resolve to valid DOM elements`);
    }

    // C. Images audit: alt, width, height
    const imgRegex = /<img\b([^>]*)>/gi;
    let imgCount = 0;
    let missingAttrs = 0;
    while ((m = imgRegex.exec(content)) !== null) {
        imgCount++;
        const attrs = m[1];
        const hasAlt = /\balt=["']/i.test(attrs);
        const hasWidth = /\bwidth=["']/i.test(attrs);
        const hasHeight = /\bheight=["']/i.test(attrs);
        const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : 'unknown';

        if (!hasAlt) {
            logError(`${file}: Image missing alt attribute: ${src}`);
            missingAttrs++;
        }
        if (!hasWidth || !hasHeight) {
            logError(`${file}: Image missing explicit width or height: ${src}`);
            missingAttrs++;
        }
    }
    if (missingAttrs === 0) {
        logSuccess(`${file}: All ${imgCount} static <img> tags have explicit alt, width, and height`);
    }

    // D. Referenced Local Files (src, href, url)
    const refRegex = /\b(?:src|href)=["']([^"']+)["']/gi;
    let missingRefs = 0;
    while ((m = refRegex.exec(content)) !== null) {
        const ref = m[1];
        if (ref.startsWith('http:') || ref.startsWith('https:') || ref.startsWith('#') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('data:') || ref.startsWith('javascript:')) {
            continue;
        }
        // Normalize leading slash
        const cleanRef = ref.split('?')[0].replace(/^\//, '');
        let targetPath = path.join(ROOT_DIR, cleanRef);
        // Handle clean URLs (e.g. /cv -> cv.html, or / -> index.html)
        if (!fs.existsSync(targetPath)) {
            if (fs.existsSync(targetPath + '.html')) {
                targetPath = targetPath + '.html';
            } else if (cleanRef === '' && fs.existsSync(path.join(ROOT_DIR, 'index.html'))) {
                targetPath = path.join(ROOT_DIR, 'index.html');
            }
        }
        if (!fs.existsSync(targetPath)) {
            logError(`${file}: Referenced file does not exist: ${ref} -> ${targetPath}`);
            missingRefs++;
        }
    }
    if (missingRefs === 0) {
        logSuccess(`${file}: Zero missing referenced local files`);
    }
});

// Step 3: Performance Tier Detection Matrix Tests
console.log('\n--- Step 3: Checking Performance Tier Detection Matrix ---');
try {
    const { runAll } = require('./test-perf-tier.js');
    runAll();
    logSuccess('All Performance Tier matrix assertions passed across index.html & cv.html');
} catch (err) {
    logError('Performance tier matrix test failed: ' + err.message);
}

console.log('\n--- Summary ---');
console.log(`Total Errors: ${errors}`);
console.log(`Total Warnings: ${warnings}`);

if (errors > 0) {
    console.error('\n❌ Integrity verification FAILED.');
    process.exit(1);
} else {
    console.log('\n✨ Integrity verification PASSED successfully!');
    process.exit(0);
}
