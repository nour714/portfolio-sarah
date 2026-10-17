import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8089;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}`);
    
    // Test fetching index.html, style.css, projects.js, skills, certificates
    const urls = [
        `http://localhost:${PORT}/index.html`,
        `http://localhost:${PORT}/admin.html`,
        `http://localhost:${PORT}/cv.html`,
        `http://localhost:${PORT}/style.css`,
        `http://localhost:${PORT}/css/admin/admin.css`,
        `http://localhost:${PORT}/css/components/skills.css`,
        `http://localhost:${PORT}/css/components/projects.css`,
        `http://localhost:${PORT}/css/components/certificates.css`,
        `http://localhost:${PORT}/js/main.js`,
        `http://localhost:${PORT}/js/modules/skills.js`,
        `http://localhost:${PORT}/js/modules/projects.js`,
        `http://localhost:${PORT}/js/modules/certificates.js`,
        `http://localhost:${PORT}/js/data/portfolio-data.js`,
        `http://localhost:${PORT}/js/data/projects.js`,
        `http://localhost:${PORT}/js/data/certificates.js`
    ];

    let passed = true;
    for (const url of urls) {
        try {
            const resp = await fetch(url);
            if (resp.status === 200) {
                console.log(`✅ [200 OK] ${url} (${resp.headers.get('content-type')})`);
            } else {
                console.error(`❌ [${resp.status}] ${url}`);
                passed = false;
            }
        } catch (err) {
            console.error(`❌ Failed fetching ${url}:`, err.message);
            passed = false;
        }
    }

    server.close(() => {
        console.log(passed ? '🎉 All endpoints verified successfully!' : '❌ Some endpoints failed');
        process.exit(passed ? 0 : 1);
    });
});
