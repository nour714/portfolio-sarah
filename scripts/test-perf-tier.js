/**
 * Automated Performance Tier Matrix Test Suite (Task 5)
 * Plain Node.js with vm module (no browser needed)
 * Tests the synchronous detection <script> embedded in index.html and cv.html
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

function extractDetectionScript(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<!-- Device & Performance Tier Synchronous Detection -->\s*<script>([\s\S]*?)<\/script>/);
    if (!match || !match[1]) {
        throw new Error(`Failed to extract performance detection script from ${filePath}`);
    }
    return match[1];
}

function runDetection(code, opts = {}) {
    const classList = new Set();
    const doc = opts.omitDocument ? undefined : {
        documentElement: {
            classList: {
                add: (c) => classList.add(c),
                contains: (c) => classList.has(c)
            }
        }
    };
    const win = opts.omitWindow ? undefined : {
        location: opts.omitLocation ? undefined : { search: opts.search || '' },
        matchMedia: opts.omitMatchMedia ? undefined : (q) => ({
            matches: q.includes('hover: none') && q.includes('pointer: coarse')
                ? Boolean(opts.isTouch)
                : q.includes('prefers-reduced-motion')
                    ? Boolean(opts.reducedMotion)
                    : false
        })
    };
    const nav = opts.omitNavigator ? undefined : {
        deviceMemory: opts.deviceMemory,
        hardwareConcurrency: opts.hardwareConcurrency,
        connection: (opts.omitConnection) ? undefined : {
            saveData: Boolean(opts.saveData),
            effectiveType: opts.effectiveType || '4g'
        }
    };

    const sandbox = {
        window: win,
        document: doc,
        navigator: nav,
        URLSearchParams: URLSearchParams
    };

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    return {
        perf: win ? win.__perf : undefined,
        isTouchClass: classList.has('is-touch'),
        perfLiteClass: classList.has('perf-lite')
    };
}

function runMatrixForFile(fileName) {
    const filePath = path.join(ROOT_DIR, fileName);
    console.log(`\n🧪 Testing performance tier detection in ${fileName}...`);
    const code = extractDetectionScript(filePath);

    // 1. Desktop 1440px, mouse, 16GB, 8 cores -> no is-touch, no perf-lite
    {
        const res = runDetection(code, { isTouch: false, deviceMemory: 16, hardwareConcurrency: 8, effectiveType: '4g' });
        assert.strictEqual(res.perf.isTouch, false, 'Desktop 1440px must have isTouch === false');
        assert.strictEqual(res.perf.lite, false, 'Desktop 1440px must have lite === false');
        assert.strictEqual(res.isTouchClass, false, 'Desktop 1440px must not have is-touch class');
        assert.strictEqual(res.perfLiteClass, false, 'Desktop 1440px must not have perf-lite class');
        console.log('  ✓ Case 1: Desktop 1440px, mouse, 16GB, 8 cores -> no is-touch, no perf-lite');
    }

    // 2. Desktop with 2GB RAM, 2 cores, saveData true, effectiveType "2g", prefers-reduced-motion true -> still NOT lite
    {
        const res = runDetection(code, {
            isTouch: false,
            deviceMemory: 2,
            hardwareConcurrency: 2,
            saveData: true,
            effectiveType: '2g',
            reducedMotion: true
        });
        assert.strictEqual(res.perf.isTouch, false, 'Desktop with low specs must have isTouch === false');
        assert.strictEqual(res.perf.lite, false, 'Desktop with low specs is NEVER lite automatically');
        assert.strictEqual(res.isTouchClass, false, 'Desktop must not have is-touch class');
        assert.strictEqual(res.perfLiteClass, false, 'Desktop must not have perf-lite class');
        console.log('  ✓ Case 2: Desktop 2GB RAM, 2 cores, saveData, 2g, reduced-motion -> still NOT lite');
    }

    // 3. Desktop + ?perf=lite -> lite. Desktop + ?perf=full -> not lite.
    {
        const resLite = runDetection(code, { isTouch: false, search: '?perf=lite' });
        assert.strictEqual(resLite.perf.lite, true, 'Desktop + ?perf=lite must have lite === true');
        assert.strictEqual(resLite.perfLiteClass, true, 'Desktop + ?perf=lite must have perf-lite class');

        const resFull = runDetection(code, { isTouch: false, search: '?perf=full' });
        assert.strictEqual(resFull.perf.lite, false, 'Desktop + ?perf=full must have lite === false');
        assert.strictEqual(resFull.perfLiteClass, false, 'Desktop + ?perf=full must not have perf-lite class');
        console.log('  ✓ Case 3: Desktop ?perf=lite -> lite; ?perf=full -> not lite');
    }

    // 4. Touch phone, deviceMemory 8, cores 8, 4g -> is-touch, NOT lite.
    {
        const res = runDetection(code, { isTouch: true, deviceMemory: 8, hardwareConcurrency: 8, effectiveType: '4g' });
        assert.strictEqual(res.perf.isTouch, true, 'Touch phone must have isTouch === true');
        assert.strictEqual(res.perf.lite, false, 'Capable touch phone must have lite === false');
        assert.strictEqual(res.isTouchClass, true, 'Touch phone must have is-touch class');
        assert.strictEqual(res.perfLiteClass, false, 'Capable touch phone must not have perf-lite class');
        console.log('  ✓ Case 4: Touch phone, 8GB, 8 cores, 4g -> is-touch, NOT lite');
    }

    // 5. Touch phone, deviceMemory 2 -> lite.
    {
        const res = runDetection(code, { isTouch: true, deviceMemory: 2, hardwareConcurrency: 8, effectiveType: '4g' });
        assert.strictEqual(res.perf.isTouch, true, 'Touch phone must have isTouch === true');
        assert.strictEqual(res.perf.lite, true, 'Touch phone with 2GB RAM must be lite');
        assert.strictEqual(res.isTouchClass, true, 'Touch phone must have is-touch class');
        assert.strictEqual(res.perfLiteClass, true, 'Weak touch phone must have perf-lite class');
        console.log('  ✓ Case 5: Touch phone, deviceMemory 2 -> lite');
    }

    // 6. Touch phone, cores 4 -> lite.
    {
        const res = runDetection(code, { isTouch: true, deviceMemory: 8, hardwareConcurrency: 4, effectiveType: '4g' });
        assert.strictEqual(res.perf.isTouch, true, 'Touch phone must have isTouch === true');
        assert.strictEqual(res.perf.lite, true, 'Touch phone with <= 4 cores must be lite');
        assert.strictEqual(res.isTouchClass, true, 'Touch phone must have is-touch class');
        assert.strictEqual(res.perfLiteClass, true, 'Weak touch phone must have perf-lite class');
        console.log('  ✓ Case 6: Touch phone, cores 4 -> lite');
    }

    // 7. Touch phone, saveData true -> lite. Touch phone, effectiveType "3g" -> lite.
    {
        const resData = runDetection(code, { isTouch: true, deviceMemory: 8, hardwareConcurrency: 8, saveData: true });
        assert.strictEqual(resData.perf.lite, true, 'Touch phone with saveData must be lite');

        const res3g = runDetection(code, { isTouch: true, deviceMemory: 8, hardwareConcurrency: 8, effectiveType: '3g' });
        assert.strictEqual(res3g.perf.lite, true, 'Touch phone with 3g connection must be lite');
        console.log('  ✓ Case 7: Touch phone, saveData / 3g -> lite');
    }

    // 8. Touch tablet (1024px wide), strong specs -> is-touch, NOT lite. Touch tablet, deviceMemory 2 -> lite.
    {
        const resStrong = runDetection(code, { isTouch: true, deviceMemory: 8, hardwareConcurrency: 8, effectiveType: '4g' });
        assert.strictEqual(resStrong.perf.isTouch, true, 'Touch tablet must have isTouch === true');
        assert.strictEqual(resStrong.perf.lite, false, 'Strong touch tablet must have lite === false');

        const resWeak = runDetection(code, { isTouch: true, deviceMemory: 2, hardwareConcurrency: 8 });
        assert.strictEqual(resWeak.perf.isTouch, true, 'Touch tablet must have isTouch === true');
        assert.strictEqual(resWeak.perf.lite, true, 'Touch tablet with deviceMemory 2 must be lite');
        console.log('  ✓ Case 8: Touch tablet strong -> is-touch, NOT lite; deviceMemory 2 -> lite');
    }

    // 9. iOS-like touch device (no deviceMemory, cores 6) -> NOT lite; (no deviceMemory, cores 2) -> lite.
    {
        const resiOSStrong = runDetection(code, { isTouch: true, deviceMemory: undefined, hardwareConcurrency: 6, effectiveType: '4g' });
        assert.strictEqual(resiOSStrong.perf.isTouch, true, 'iOS device must have isTouch === true');
        assert.strictEqual(resiOSStrong.perf.lite, false, 'iOS device with 6 cores and no deviceMemory must NOT be lite (defaults to strong)');

        const resiOSWeak = runDetection(code, { isTouch: true, deviceMemory: undefined, hardwareConcurrency: 2, effectiveType: '4g' });
        assert.strictEqual(resiOSWeak.perf.isTouch, true, 'iOS device must have isTouch === true');
        assert.strictEqual(resiOSWeak.perf.lite, true, 'iOS device with 2 cores must be lite');
        console.log('  ✓ Case 9: iOS touch (no deviceMemory, cores 6) -> NOT lite; cores 2 -> lite');
    }

    // 10. Touch + ?perf=full -> not lite even when weak.
    {
        const res = runDetection(code, {
            isTouch: true,
            deviceMemory: 2,
            hardwareConcurrency: 2,
            saveData: true,
            effectiveType: '2g',
            search: '?perf=full'
        });
        assert.strictEqual(res.perf.isTouch, true, 'Touch device must have isTouch === true');
        assert.strictEqual(res.perf.lite, false, 'Touch device with ?perf=full must NOT be lite even if weak');
        assert.strictEqual(res.isTouchClass, true, 'Touch device must have is-touch class');
        assert.strictEqual(res.perfLiteClass, false, 'Touch device with ?perf=full must not have perf-lite class');
        console.log('  ✓ Case 10: Touch + ?perf=full -> not lite even when weak');
    }

    // 11. matchMedia/navigator missing -> no throw, window.__perf = { isTouch:false, lite:false }.
    {
        let res;
        assert.doesNotThrow(() => {
            res = runDetection(code, { omitMatchMedia: true, omitNavigator: true });
        }, 'Missing matchMedia/navigator must not throw');
        assert.strictEqual(res.perf.isTouch, false, 'Missing APIs must have isTouch === false');
        assert.strictEqual(res.perf.lite, false, 'Missing APIs must have lite === false');
        console.log('  ✓ Case 11: Missing matchMedia/navigator -> no throw, window.__perf = { isTouch:false, lite:false }');
    }
}

function runAll() {
    console.log('🚀 Running Performance Tier Test Suite (11 Matrix Cases)...');
    runMatrixForFile('index.html');
    runMatrixForFile('cv.html');
    console.log('\n✨ All 11 Performance Tier Matrix tests PASSED across index.html & cv.html!\n');
}

if (require.main === module) {
    try {
        runAll();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Performance Tier Test FAILED:', err);
        process.exit(1);
    }
}

module.exports = { runAll, runMatrixForFile, runDetection, extractDetectionScript };
