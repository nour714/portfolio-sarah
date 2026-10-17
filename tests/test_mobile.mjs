import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

const PORT = 8124;
const CHROME_PORT = 9265;

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
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const userDataDir = path.join(os.tmpdir(), '.chrome-test-mobile-' + Date.now());

    const chromeProcess = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${userDataDir}`,
        '--window-size=390,844',
        `http://localhost:${PORT}/index.html`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetsRes = await fetch(`http://localhost:${CHROME_PORT}/json`);
        const targets = await targetsRes.json();
        const pageTarget = targets.find(t => t.type === 'page');

        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

        ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Runtime.evaluate', params: { expression: 'window.innerWidth < 768' } }));
            setTimeout(() => {
                ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: { format: 'png' } }));
            }, 1000);
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.id === 2) {
                console.log('Mobile detection (innerWidth < 768):', data.result?.result?.value);
            }
            if (data.id === 3 && data.result?.data) {
                fs.writeFileSync('tests/screenshot_mobile_start.png', Buffer.from(data.result.data, 'base64'));
                console.log('Mobile screenshot saved to tests/screenshot_mobile_start.png');
                chromeProcess.kill();
                server.close(() => process.exit(0));
            }
        };
    } catch (err) {
        console.error(err);
        chromeProcess.kill();
        server.close(() => process.exit(1));
    }
});
