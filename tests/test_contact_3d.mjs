import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const PORT = 8092;
const CHROME_PORT = 9222;
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
    const userDataDir = path.join(os.tmpdir(), '.chrome-test-contact-3d-' + Date.now());

    const chromeProcess = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${userDataDir}`,
        '--window-size=1380,1080',
        `http://localhost:${PORT}/index.html`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    const cleanup = (code = 0) => {
        try { chromeProcess.kill(); } catch (e) {}
        server.close();
        process.exit(code);
    };

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
            const curId = id++;
            const handler = (evt) => {
                const data = JSON.parse(evt.data);
                if (data.id === curId) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });

        ws.addEventListener('open', async () => {
            await send('Page.enable');
            await send('DOM.enable');
            await send('Network.enable');
            await send('Log.enable');
            await send('Runtime.enable');

            ws.addEventListener('message', (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.method === 'Network.responseReceived') {
                    console.log('NET RESP:', msg.params.response.url, msg.params.response.status);
                }
                if (msg.method === 'Network.loadingFailed') {
                    console.log('NET FAILED:', msg.params);
                }
            });

            // Scroll to contact section after page fully loads
            await new Promise(r => setTimeout(r, 3500));

            await send('Runtime.evaluate', {
                expression: `
                    (() => {
                        if (window.__lenis) {
                            window.__lenis.scrollTo('#contact', { immediate: true });
                        } else {
                            const contact = document.getElementById('contact');
                            if (contact) contact.scrollIntoView({ behavior: 'instant' });
                        }
                    })()
                `
            });

            await new Promise(r => setTimeout(r, 1000));

            // Move mouse over .contact-panel to test 3D tilt
            const panelPos = await send('Runtime.evaluate', {
                expression: `
                    (() => {
                        const panel = document.querySelector('.contact-panel');
                        if (!panel) return null;
                        const rect = panel.getBoundingClientRect();
                        return {
                            x: rect.left + rect.width * 0.75,
                            y: rect.top + rect.height * 0.3
                        };
                    })()
                `,
                returnByValue: true
            });

            if (panelPos && panelPos.result.value) {
                const { x, y } = panelPos.result.value;
                await send('Input.dispatchMouseEvent', {
                    type: 'mouseMoved',
                    x,
                    y
                });
            }

            await new Promise(r => setTimeout(r, 600));

            // Verify elements and diagnostics
            const checkRes = await send('Runtime.evaluate', {
                expression: `
                    (() => {
                        const hasGsap = !!window.gsap;
                        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
                        const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                        const panel = document.querySelector('.contact-panel');
                        const form = document.querySelector('.contact-form');
                        const spotlightPanel = panel ? panel.querySelector('.card-spotlight') : null;
                        const spotlightForm = form ? form.querySelector('.card-spotlight') : null;
                        const items = document.querySelectorAll('.contact-item');
                        const panelStyle = panel ? window.getComputedStyle(panel) : null;
                        const formStyle = form ? window.getComputedStyle(form) : null;
                        return {
                            hasGsap,
                            isCoarse,
                            isReduced,
                            hasPanel: !!panel,
                            hasForm: !!form,
                            hasSpotlightPanel: !!spotlightPanel,
                            hasSpotlightForm: !!spotlightForm,
                            itemCount: items.length,
                            panelTransformStyle: panelStyle ? panelStyle.transformStyle : null,
                            formTransformStyle: formStyle ? formStyle.transformStyle : null,
                            panelTransform: panel ? panel.style.transform : null,
                            panelOverflow: panelStyle ? panelStyle.overflow : null,
                            formOverflow: formStyle ? formStyle.overflow : null
                        };
                    })()
                `,
                returnByValue: true
            });

            console.log('✅ Contact 3D Verification Result:', checkRes.result.value);

            // Capture screenshot of viewport
            const screenshot = await send('Page.captureScreenshot', {
                format: 'png'
            });

            if (screenshot && screenshot.data) {
                fs.writeFileSync('tests/contact_3d_screenshot.png', Buffer.from(screenshot.data, 'base64'));
                console.log('📸 Contact 3D Screenshot saved to tests/contact_3d_screenshot.png');
            }

            cleanup(0);
        });

    } catch (err) {
        console.error('Error during test:', err);
        cleanup(1);
    }
});
