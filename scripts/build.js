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
    const { buildCss } = require('./build-css.js');
    buildCss();

    const mainCssContent = fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8');
    const cvCssPath = path.join(ROOT_DIR, 'css', 'cv', 'cv.css');
    let cvCssContent = fs.existsSync(cvCssPath) ? fs.readFileSync(cvCssPath, 'utf8') : '';
    const fontsPath = path.join(ROOT_DIR, 'css', 'base', 'fonts.css');
    if (cvCssContent.includes('@import "../base/fonts.css";') && fs.existsSync(fontsPath)) {
        cvCssContent = cvCssContent.replace('@import "../base/fonts.css";', fs.readFileSync(fontsPath, 'utf8'));
    }

    // 2. Minify CSS with esbuild
    console.log('⚡ [build] Step 2: Minifying CSS with esbuild...');
    const mainCssResult = await esbuild.transform(mainCssContent, {
        loader: 'css',
        minify: true,
        sourcemap: true,
        sourcefile: 'main.css'
    });

    let mainCssCode = mainCssResult.code.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '').trim();
    const mainCssHash = getHash(mainCssCode);
    const mainCssHashedName = `main.${mainCssHash}.min.css`;
    const mainCssMapName = `${mainCssHashedName}.map`;
    mainCssCode += `\n/*# sourceMappingURL=${mainCssMapName} */\n`;

    fs.writeFileSync(path.join(CSS_DIST, mainCssHashedName), mainCssCode, 'utf8');
    fs.writeFileSync(path.join(CSS_DIST, 'main.min.css'), mainCssCode, 'utf8');
    fs.writeFileSync(path.join(CSS_DIST, mainCssMapName), mainCssResult.map, 'utf8');
    console.log(`  ✓ css/dist/${mainCssHashedName} (${(Buffer.byteLength(mainCssCode) / 1024).toFixed(1)} KB)`);

    let cvCssHashedName = '';
    if (cvCssContent) {
        const cvCssResult = await esbuild.transform(cvCssContent, {
            loader: 'css',
            minify: true,
            sourcemap: true,
            sourcefile: 'cv.css'
        });
        let cvCssCode = cvCssResult.code.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '').trim();
        const cvCssHash = getHash(cvCssCode);
        cvCssHashedName = `cv.${cvCssHash}.min.css`;
        const cvCssMapName = `${cvCssHashedName}.map`;
        cvCssCode += `\n/*# sourceMappingURL=${cvCssMapName} */\n`;

        fs.writeFileSync(path.join(CSS_DIST, cvCssHashedName), cvCssCode, 'utf8');
        fs.writeFileSync(path.join(CSS_DIST, 'cv.min.css'), cvCssCode, 'utf8');
        fs.writeFileSync(path.join(CSS_DIST, cvCssMapName), cvCssResult.map, 'utf8');
        console.log(`  ✓ css/dist/${cvCssHashedName} (${(Buffer.byteLength(cvCssCode) / 1024).toFixed(1)} KB)`);
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

    const rawJsCode = jsBundle.outputFiles.find((f) => f.path.endsWith('.js')).text;
    const jsMap = jsBundle.outputFiles.find((f) => f.path.endsWith('.map')).text;
    const baseJsCode = rawJsCode.replace(/\/\/# sourceMappingURL=[^\r\n]*/g, '').trim();
    const jsHash = getHash(baseJsCode);
    const mainJsHashedName = `main.${jsHash}.min.js`;
    const mainJsMapName = `${mainJsHashedName}.map`;
    const finalJsCode = `${baseJsCode}\n//# sourceMappingURL=${mainJsMapName}\n`;

    fs.writeFileSync(path.join(JS_DIST, mainJsHashedName), finalJsCode, 'utf8');
    fs.writeFileSync(path.join(JS_DIST, 'main.min.js'), finalJsCode, 'utf8');
    fs.writeFileSync(path.join(JS_DIST, mainJsMapName), jsMap, 'utf8');
    console.log(`  ✓ js/dist/${mainJsHashedName} (${(Buffer.byteLength(finalJsCode) / 1024).toFixed(1)} KB)`);

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
        const rawCvJsCode = cvJsBundle.outputFiles.find((f) => f.path.endsWith('.js')).text;
        const cvJsMap = cvJsBundle.outputFiles.find((f) => f.path.endsWith('.map')).text;
        const baseCvJsCode = rawCvJsCode.replace(/\/\/# sourceMappingURL=[^\r\n]*/g, '').trim();
        const cvJsHash = getHash(baseCvJsCode);
        cvJsHashedName = `cv.${cvJsHash}.min.js`;
        const cvJsMapName = `${cvJsHashedName}.map`;
        const finalCvJsCode = `${baseCvJsCode}\n//# sourceMappingURL=${cvJsMapName}\n`;

        fs.writeFileSync(path.join(JS_DIST, cvJsHashedName), finalCvJsCode, 'utf8');
        fs.writeFileSync(path.join(JS_DIST, 'cv.min.js'), finalCvJsCode, 'utf8');
        fs.writeFileSync(path.join(JS_DIST, cvJsMapName), cvJsMap, 'utf8');
        console.log(`  ✓ js/dist/${cvJsHashedName} (${(Buffer.byteLength(finalCvJsCode) / 1024).toFixed(1)} KB)`);
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
