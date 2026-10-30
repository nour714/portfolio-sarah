const fs = require('fs');
const path = require('path');

function evaluateVercelHeaders(vercelJsonPath, testPaths) {
    const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    const rules = config.headers || [];

    // Compile rules into regex
    const compiledRules = rules.map((r, index) => {
        let pattern = r.source;
        // Escape special chars except capture groups, wildcards
        // In vercel.json, patterns are like "/(.*)", "/fonts/(.*)", "/(js|css)/dist/(.*\\.[a-f0-9]{8}\\..*)"
        // If pattern starts with /, anchor to start and end
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
        console.log('');
    });
}

const testPaths = [
    '/',
    '/cv',
    '/fonts/poppins-400.woff2',
    '/js/dist/main.e7fcc50c.min.js',
    '/css/dist/main.e2c874aa.min.css',
    '/images/og-cover.jpg',
    '/cv.pdf'
];

evaluateVercelHeaders(path.resolve(__dirname, '..', 'vercel.json'), testPaths);
