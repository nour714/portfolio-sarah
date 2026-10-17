import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import os from 'os';

const PORT = 8099;
const CHROME_PORT = 9229;
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
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const userDataDir = path.join(os.tmpdir(), '.chrome-test-profile-console-' + Date.now());

    const chromeProcess = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${userDataDir}`,
        '--window-size=1280,1000',
        `http://localhost:${PORT}/index.html`
    ]);

    await new Promise(r => setTimeout(r, 2000));
    const targetsRes = await fetch(`http://localhost:${CHROME_PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    ws.addEventListener('open', () => {
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
    });

    ws.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.method === 'Console.messageAdded' || data.method === 'Runtime.consoleAPICalled' || data.method === 'Runtime.exceptionThrown') {
            console.log('BROWSER LOG:', JSON.stringify(data, null, 2));
        }
    });

    setTimeout(async () => {
        const evalRes = await new Promise(res => {
            const id = 99;
            const handler = (e) => {
                const d = JSON.parse(e.data);
                if (d.id === id) {
                    ws.removeEventListener('message', handler);
                    res(d.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
                id,
                method: 'Runtime.evaluate',
                params: { expression: 'document.querySelector(".skills-board").innerHTML' }
            }));
        });
        console.log('skills-board innerHTML length:', evalRes?.result?.value?.length);
        chromeProcess.kill();
        server.close(() => process.exit(0));
    }, 4000);
});
