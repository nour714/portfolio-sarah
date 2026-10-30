const fs = require('fs');
const path = require('path');

function evaluateVercelHeaders(vercelJsonPath, testPaths) {
    const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    const rules = config.headers || [];

    // Compile rules into regex
    const compiledRules = rules.map((r, index) => {
        let pattern = r.source;
        const regex = new RegExp(`^${pattern}$`);
        return {
            index: index + 1,
            source: r.source,
            regex,
            headers: r.headers
        };
    });

    console.log(`Evaluating ${testPaths.length} paths against ${compiledRules.length} Vercel header rules:\n`);

    testPaths.forEach(testPath => {
        const effectiveHeaders = {};
        const matchedRules = [];

        compiledRules.forEach(rule => {
            if (rule.regex.test(testPath)) {
                matchedRules.push(rule);
                rule.headers.forEach(h => {
                    effectiveHeaders[h.key] = h.value;
                });
            }
        });

        console.log(`Path: ${testPath}`);
        console.log(`  Matched Rules: ${matchedRules.map(r => `#${r.index} (${r.source})`).join(' -> ')}`);
        console.log(`  Effective Cache-Control: ${effectiveHeaders['Cache-Control'] || '(none)'}`);
        if (effectiveHeaders['Content-Security-Policy']) {
            const csp = effectiveHeaders['Content-Security-Policy'];
            const objSrcMatch = csp.match(/object-src\s+([^;]+)/);
            console.log(`  Effective CSP object-src: ${objSrcMatch ? objSrcMatch[1] : '(fallback to default-src)'}`);
        } else {
            console.log(`  Effective CSP: (none)`);
        }
        console.log('');
    });
}

const testPaths = [
    '/',
    '/cv',
    '/fonts/poppins-400.woff2',
    '/js/dist/main.653dc7a2.min.js',
    '/css/dist/main.822c292f.min.css',
    '/images/og-cover.jpg',
    '/cv.pdf',
    '/images/certificates/deep-learning.pdf'
];

evaluateVercelHeaders(path.resolve(__dirname, '..', 'vercel.json'), testPaths);
