/**
 * Production Build Script
 * Bundles & minifies JS modules with esbuild, minifies CSS, generates content hashes,
 * rewrites script/link tags in index.html & cv.html, and prepares immutable assets.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

const ROOT_DIR = path.resolve(__dirname, '..');
const JS_DIST = path.join(ROOT_DIR, 'js', 'dist');
const CSS_DIST = path.join(ROOT_DIR, 'css', 'dist');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const CV_HTML = path.join(ROOT_DIR, 'cv.html');

// Helper to compute sha256 8-char hash
function getHash(bufferOrString) {
    return crypto.createHash('sha256').update(bufferOrString).digest('hex').slice(0, 8);
}

// Clean and ensure dist directories
function prepareDistDirs() {
    [JS_DIST, CSS_DIST].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } else {
            // Remove previous build artifacts
            fs.readdirSync(dir).forEach((f) => {
                const fullPath = path.join(dir, f);
                try {
                    if (fs.statSync(fullPath).isFile()) fs.unlinkSync(fullPath);
                } catch (_) {}
            });
        }
    });
}

async function runBuild() {
    console.log('🚀 [build] Starting production build...');
    prepareDistDirs();

    // 1. Build Master CSS via scripts/build-css.js first
    console.log('📦 [build] Step 1: Concatenating CSS layers into css/main.css...');
    require('./build-css.js');

    const mainCssContent = fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8');
    const cvCssPath = path.join(ROOT_DIR, 'css', 'cv', 'cv.css');
    const cvCssContent = fs.existsSync(cvCssPath) ? fs.readFileSync(cvCssPath, 'utf8') : '';

    // 2. Minify CSS with esbuild
    console.log('⚡ [build] Step 2: Minifying CSS with esbuild...');
    const mainCssResult = await esbuild.transform(mainCssContent, {
        loader: 'css',
        minify: true,
        sourcemap: true,
        sourcefile: 'main.css'
    });

    const mainCssHash = getHash(mainCssResult.code);
    const mainCssHashedName = `main.${mainCssHash}.min.css`;
    fs.writeFileSync(path.join(CSS_DIST, mainCssHashedName), mainCssResult.code, 'utf8');
    fs.writeFileSync(path.join(CSS_DIST, 'main.min.css'), mainCssResult.code, 'utf8');
    fs.writeFileSync(path.join(CSS_DIST, `${mainCssHashedName}.map`), mainCssResult.map, 'utf8');
    console.log(`  ✓ css/dist/${mainCssHashedName} (${(Buffer.byteLength(mainCssResult.code) / 1024).toFixed(1)} KB)`);

    let cvCssHashedName = '';
    if (cvCssContent) {
        const cvCssResult = await esbuild.transform(cvCssContent, {
            loader: 'css',
            minify: true,
            sourcemap: true,
            sourcefile: 'cv.css'
        });
        const cvCssHash = getHash(cvCssResult.code);
        cvCssHashedName = `cv.${cvCssHash}.min.css`;
        fs.writeFileSync(path.join(CSS_DIST, cvCssHashedName), cvCssResult.code, 'utf8');
        fs.writeFileSync(path.join(CSS_DIST, 'cv.min.css'), cvCssResult.code, 'utf8');
        fs.writeFileSync(path.join(CSS_DIST, `${cvCssHashedName}.map`), cvCssResult.map, 'utf8');
        console.log(`  ✓ css/dist/${cvCssHashedName} (${(Buffer.byteLength(cvCssResult.code) / 1024).toFixed(1)} KB)`);
    }

    // 3. Bundle JS Modules with esbuild
    console.log('⚡ [build] Step 3: Bundling and minifying JS modules...');
    const jsBundle = await esbuild.build({
        entryPoints: [path.join(ROOT_DIR, 'js', 'main.js')],
        bundle: true,
        minify: true,
        sourcemap: true,
        format: 'esm',
        target: 'es2020',
        outfile: path.join(JS_DIST, 'main.js'),
        write: false
    });

    const jsCode = jsBundle.outputFiles.find((f) => f.path.endsWith('.js')).text;
    const jsMap = jsBundle.outputFiles.find((f) => f.path.endsWith('.map')).text;
    const jsHash = getHash(jsCode);
    const mainJsHashedName = `main.${jsHash}.min.js`;

    fs.writeFileSync(path.join(JS_DIST, mainJsHashedName), jsCode, 'utf8');
    fs.writeFileSync(path.join(JS_DIST, 'main.min.js'), jsCode, 'utf8');
    fs.writeFileSync(path.join(JS_DIST, `${mainJsHashedName}.map`), jsMap, 'utf8');
    console.log(`  ✓ js/dist/${mainJsHashedName} (${(Buffer.byteLength(jsCode) / 1024).toFixed(1)} KB)`);

    // Bundle cv.js
    const cvJsPath = path.join(ROOT_DIR, 'js', 'cv.js');
    let cvJsHashedName = '';
    if (fs.existsSync(cvJsPath)) {
        const cvJsBundle = await esbuild.build({
            entryPoints: [cvJsPath],
            bundle: true,
            minify: true,
            sourcemap: true,
            format: 'esm',
            target: 'es2020',
            outfile: path.join(JS_DIST, 'cv.js'),
            write: false
        });
        const cvJsCode = cvJsBundle.outputFiles.find((f) => f.path.endsWith('.js')).text;
        const cvJsMap = cvJsBundle.outputFiles.find((f) => f.path.endsWith('.map')).text;
        const cvJsHash = getHash(cvJsCode);
        cvJsHashedName = `cv.${cvJsHash}.min.js`;
        fs.writeFileSync(path.join(JS_DIST, cvJsHashedName), cvJsCode, 'utf8');
        fs.writeFileSync(path.join(JS_DIST, 'cv.min.js'), cvJsCode, 'utf8');
        fs.writeFileSync(path.join(JS_DIST, `${cvJsHashedName}.map`), cvJsMap, 'utf8');
        console.log(`  ✓ js/dist/${cvJsHashedName} (${(Buffer.byteLength(cvJsCode) / 1024).toFixed(1)} KB)`);
    }

    // 4. Update index.html
    console.log('📝 [build] Step 4: Rewriting asset tags in index.html...');
    if (fs.existsSync(INDEX_HTML)) {
        let indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');

        // Rewrite stylesheet link to hashed dist
        indexHtml = indexHtml.replace(
            /<link\s+rel=["']stylesheet["']\s+href=["'][^"']*(?:style\.css|css\/main\.css|css\/dist\/main)[^"']*["']\s*>/i,
            `<link rel="stylesheet" href="/css/dist/${mainCssHashedName}">`
        );

        // Rewrite vendor scripts and module entry point
        // Ensure gsap and ScrollTrigger have defer, remove static lenis link, point main.js to hashed bundle
        const vendorBlockRegex = /<!--\s*GSAP,\s*ScrollTrigger\s*&?\s*Lenis[^>]*-->[\s\S]*?<script[^>]+src=["'][^"']*main(?:\.[^"']*)?\.js["'][^>]*><\/script>/i;
        const newVendorBlock = `<!-- GSAP & ScrollTrigger Vendor Engines (deferred in order) -->\n    <script defer src="/js/vendor/gsap.min.js"></script>\n    <script defer src="/js/vendor/ScrollTrigger.min.js"></script>\n\n    <!-- Application Bootstrap (Bundled & Minified ES Module) -->\n    <script type="module" src="/js/dist/${mainJsHashedName}"></script>`;

        if (vendorBlockRegex.test(indexHtml)) {
            indexHtml = indexHtml.replace(vendorBlockRegex, newVendorBlock);
        } else {
            // Fallback replacement if block comments slightly differ
            indexHtml = indexHtml.replace(
                /<script\s+src=["'][^"']*gsap(?:\.min)?\.js["']\s*><\/script>/i,
                '<script defer src="/js/vendor/gsap.min.js"></script>'
            );
            indexHtml = indexHtml.replace(
                /<script\s+src=["'][^"']*ScrollTrigger(?:\.min)?\.js["']\s*><\/script>/i,
                '<script defer src="/js/vendor/ScrollTrigger.min.js"></script>'
            );
            indexHtml = indexHtml.replace(
                /<script\s+src=["'][^"']*lenis(?:\.min)?\.js["']\s*><\/script>\s*/i,
                ''
            );
            indexHtml = indexHtml.replace(
                /<script\s+type=["']module["']\s+src=["'][^"']*main(?:\.[^"']*)?\.js["']\s*><\/script>/i,
                `<script type="module" src="/js/dist/${mainJsHashedName}"></script>`
            );
        }

        fs.writeFileSync(INDEX_HTML, indexHtml, 'utf8');
        console.log('  ✓ index.html successfully updated with hashed bundle and deferred vendor scripts');
    }

    // 5. Update cv.html
    console.log('📝 [build] Step 5: Rewriting asset tags in cv.html...');
    if (fs.existsSync(CV_HTML) && cvCssHashedName && cvJsHashedName) {
        let cvHtml = fs.readFileSync(CV_HTML, 'utf8');

        // Rewrite cv.css
        cvHtml = cvHtml.replace(
            /<link\s+rel=["']stylesheet["']\s+href=["'][^"']*(?:cv\.css|css\/dist\/cv)[^"']*["']\s*>/i,
            `<link rel="stylesheet" href="/css/dist/${cvCssHashedName}">`
        );

        // Rewrite cv.js
        cvHtml = cvHtml.replace(
            /<script\s+type=["']module["']\s+src=["'][^"']*(?:cv\.js|js\/dist\/cv)[^"']*["']\s*><\/script>/i,
            `<script type="module" src="/js/dist/${cvJsHashedName}"></script>`
        );

        fs.writeFileSync(CV_HTML, cvHtml, 'utf8');
        console.log('  ✓ cv.html successfully updated with hashed bundle');
    }

    console.log('✨ [build] Production build completed successfully!');
}

if (require.main === module) {
    runBuild().catch((err) => {
        console.error('❌ [build] Build failed:', err);
        process.exit(1);
    });
}

module.exports = { runBuild };
