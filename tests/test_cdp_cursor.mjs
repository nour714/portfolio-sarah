import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const PORT = 8093;
const CHROME_PORT = 9223;
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
    console.log(`Server started on http://localhost:${PORT}`);
    const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    const userDataDir = path.join(os.tmpdir(), '.chrome-test-profile-' + Date.now());

    const chromeProcess = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${userDataDir}`,
        '--window-size=1280,800',
        `http://localhost:${PORT}/index.html`
    ]);

    // Wait for Chrome to initialize
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

        ws.onopen = async () => {
            console.log('Connected to Chrome CDP WebSocket');

            // Dispatch mouse event to (300, 200)
            await send('Input.dispatchMouseEvent', {
                type: 'mouseMoved',
                x: 300,
                y: 200
            });

            // Wait a brief moment
            await new Promise(r => setTimeout(r, 600));

            // Evaluate cursor state in DOM
            const evalResult = await send('Runtime.evaluate', {
                expression: `(() => {
                    const cursor = document.querySelector('.macos-cursor');
                    const arrow = document.querySelector('.macos-cursor-arrow');
                    const hand = document.querySelector('.macos-cursor-hand');
                    const bodyHasClass = document.body.classList.contains('has-macos-cursor');
                    return {
                        cursorExists: !!cursor,
                        arrowExists: !!arrow,
                        handExists: !!hand,
                        bodyHasClass,
                        cursorTransform: cursor ? cursor.style.transform : null,
                        arrowVisible: arrow ? getComputedStyle(arrow).opacity : null,
                        handVisible: hand ? getComputedStyle(hand).opacity : null
                    };
                })()`,
                returnByValue: true
            });

            console.log('Cursor state on page:', evalResult.result.value);

            // Now move to a button to test hover state
            const buttonPos = await send('Runtime.evaluate', {
                expression: `(() => {
                    const btn = document.querySelector('a, button, [role="button"]');
                    if (!btn) return null;
                    const rect = btn.getBoundingClientRect();
                    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                })()`,
                returnByValue: true
            });

            if (buttonPos.result.value) {
                const pos = buttonPos.result.value;
                await send('Input.dispatchMouseEvent', {
                    type: 'mouseMoved',
                    x: pos.x,
                    y: pos.y
                });
                await new Promise(r => setTimeout(r, 400));

                const hoverResult = await send('Runtime.evaluate', {
                    expression: `(() => {
                        const cursor = document.querySelector('.macos-cursor');
                        const arrow = document.querySelector('.macos-cursor-arrow');
                        const hand = document.querySelector('.macos-cursor-hand');
                        return {
                            isHovering: cursor.classList.contains('is-hovering'),
                            arrowOpacity: getComputedStyle(arrow).opacity,
                            handOpacity: getComputedStyle(hand).opacity
                        };
                    })()`,
                    returnByValue: true
                });

                console.log('Cursor hover state on button:', hoverResult.result.value);
            }

            // Capture screenshot with cursor
            const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
            if (screenshotRes.data) {
                fs.mkdirSync('tests/screenshots', { recursive: true });
                fs.writeFileSync('tests/screenshots/macos_cursor_hover_verified.png', Buffer.from(screenshotRes.data, 'base64'));
                console.log('✅ Captured tests/screenshots/macos_cursor_hover_verified.png');
            }

            ws.close();
            cleanup(0);
        };
    } catch (e) {
        console.error('Error during CDP testing:', e.message);
        cleanup(1);
    }

    function cleanup(code) {
        chromeProcess.kill();
        server.close(() => {
            process.exit(code);
        });
    }
});
