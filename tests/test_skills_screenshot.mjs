import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const PORT = 8098;
const CHROME_PORT = 9228;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.webp': 'image/webp'
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
    const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    const userDataDir = path.join(os.tmpdir(), '.chrome-test-profile-skills-' + Date.now());

    const chromeProcess = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${userDataDir}`,
        '--window-size=1280,1000',
        `http://localhost:${PORT}/index.html`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetsRes = await fetch(`http://localhost:${CHROME_PORT}/json`);
        const targets = await targetsRes.json();
        const pageTarget = targets.find(t => t.type === 'page');

        if (!pageTarget) {
            console.error('No page target found');
            cleanup(1);
            return;
        }

        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
            const reqId = id++;
            const handler = (event) => {
                const data = JSON.parse(event.data);
                if (data.id === reqId) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: reqId, method, params }));
        });

        await new Promise(r => ws.addEventListener('open', r, { once: true }));

        // Wait for hydration
        await new Promise(r => setTimeout(r, 1500));

        // Scroll to skills
        await send('Runtime.evaluate', {
            expression: `document.getElementById('skills').scrollIntoView({ block: 'start' });`
        });

        await new Promise(r => setTimeout(r, 800));

        // Take screenshot of viewport
        const screenshotResult = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('tests/skills_render.png', Buffer.from(screenshotResult.data, 'base64'));
        console.log('✅ Screenshot saved to tests/skills_render.png');

        ws.close();
        cleanup(0);
    } catch (err) {
        console.error('Test error:', err);
        cleanup(1);
    }

    function cleanup(code) {
        chromeProcess.kill();
        server.close(() => {
            process.exit(code);
        });
    }
});
