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

server.listen(8125, async () => {
    console.log('HTTP Server listening on 8125');

    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9226',
        '--window-size=1280,1024',
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    try {
        const tabRes = await fetch('http://127.0.0.1:9226/json/new?about:blank', { method: 'PUT' });
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

        console.log('Navigating to http://localhost:8125...');
        await send('Page.navigate', { url: 'http://localhost:8125' });
        await pageLoaded;
        console.log('Page loaded!');

        // Wait 1.5s for initial render
        await new Promise(r => setTimeout(r, 1500));

        // Scroll stage into view so IntersectionObserver marks it visible
        await send('Runtime.evaluate', {
            expression: `document.getElementById("skills-arc-stage")?.scrollIntoView({ behavior: "instant", block: "center" });`
        });

        const initialRes = await send('Runtime.evaluate', {
            expression: `(() => ({
                title: document.getElementById("spotlight-title")?.textContent,
                counter: document.getElementById("spotlight-counter")?.textContent
            }))()`,
            returnByValue: true
        });

        console.log('Initial skill state:', initialRes.result?.value);

        // Wait 2.6 seconds for Auto-Play transition
        console.log('Waiting 2.6s for automatic skill switch #1...');
        await new Promise(r => setTimeout(r, 2600));

        const autoStep1Res = await send('Runtime.evaluate', {
            expression: `(() => ({
                title: document.getElementById("spotlight-title")?.textContent,
                counter: document.getElementById("spotlight-counter")?.textContent
            }))()`,
            returnByValue: true
        });

        console.log('Auto-Play Step 1 result:', autoStep1Res.result?.value);

        // Wait another 2.6 seconds for Auto-Play transition #2
        console.log('Waiting 2.6s for automatic skill switch #2...');
        await new Promise(r => setTimeout(r, 2600));

        const autoStep2Res = await send('Runtime.evaluate', {
            expression: `(() => ({
                title: document.getElementById("spotlight-title")?.textContent,
                counter: document.getElementById("spotlight-counter")?.textContent
            }))()`,
            returnByValue: true
        });

        console.log('Auto-Play Step 2 result:', autoStep2Res.result?.value);

        const success = autoStep1Res.result?.value?.title !== initialRes.result?.value?.title &&
                        autoStep2Res.result?.value?.title !== autoStep1Res.result?.value?.title;

        console.log(success ? '🎉 AUTO-PLAY VERIFIED SUCCESSFULLY!' : '❌ Auto-play did not advance automatically');

        ws.close();
    } catch (err) {
        console.error('Error during auto-play verification:', err);
    } finally {
        chrome.kill();
        server.close();
        process.exit(0);
    }
});
