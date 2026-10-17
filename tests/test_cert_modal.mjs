import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(8128, async () => {
    console.log('HTTP Server listening on 8128');

    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9229',
        '--window-size=1280,900',
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    try {
        const tabRes = await fetch('http://127.0.0.1:9229/json/new?about:blank', { method: 'PUT' });
        const tabData = await tabRes.json();
        const wsUrl = tabData.webSocketDebuggerUrl;

        const ws = new globalThis.WebSocket(wsUrl);
        let idCounter = 1;
        const pending = new Map();
        let pageLoadedResolve = null;
        const pageLoaded = new Promise(r => { pageLoadedResolve = r; });

        const send = (method, params = {}) => new Promise((resolve) => {
            const id = idCounter++;
            pending.set(id, resolve);
            ws.send(JSON.stringify({ id, method, params }));
        });

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Page.loadEventFired') {
                if (pageLoadedResolve) pageLoadedResolve();
            }
            if (msg.id && pending.has(msg.id)) {
                pending.get(msg.id)(msg.result);
                pending.delete(msg.id);
            }
        };

        await new Promise(r => ws.onopen = r);
        console.log('CDP WebSocket opened');

        await send('Page.enable');
        await send('Runtime.enable');

        console.log('Navigating to http://localhost:8128...');
        await send('Page.navigate', { url: 'http://localhost:8128' });
        await pageLoaded;
        console.log('Page loaded!');

        await new Promise(r => setTimeout(r, 1200));

        // Trigger openCertificateModal for the first certificate
        await send('Runtime.evaluate', {
            expression: `(() => {
                const card = document.querySelector('.certificate-card');
                if (card) {
                    card.click();
                    return 'clicked';
                }
                return 'card not found';
            })()`
        });

        await new Promise(r => setTimeout(r, 800));

        // Take a screenshot of the opened modal
        const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('tests/cert_modal_rendered.png', Buffer.from(screenshotData.data, 'base64'));
        console.log('Screenshot saved to tests/cert_modal_rendered.png');

        ws.close();
    } catch (err) {
        console.error('Test error:', err);
    } finally {
        chrome.kill();
        server.close();
        process.exit(0);
    }
});
