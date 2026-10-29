const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');

// The 8 devicon icons used in the site
const ICONS = [
    { id: 'devicon-github-original', file: 'github/github-original.svg', fillCurrent: true },
    { id: 'devicon-linkedin-plain', file: 'linkedin/linkedin-plain.svg', fillCurrent: true },
    { id: 'devicon-python-plain', file: 'python/python-plain.svg', fillCurrent: false },
    { id: 'devicon-pandas-plain', file: 'pandas/pandas-plain.svg', fillCurrent: false },
    { id: 'devicon-numpy-plain', file: 'numpy/numpy-plain.svg', fillCurrent: false },
    { id: 'devicon-scikitlearn-plain', file: 'scikitlearn/scikitlearn-plain.svg', fillCurrent: false },
    { id: 'devicon-matplotlib-plain', file: 'matplotlib/matplotlib-plain.svg', fillCurrent: false },
    { id: 'devicon-git-plain', file: 'git/git-plain.svg', fillCurrent: false }
];

function generateSprite() {
    console.log('[build-devicon-sprite] Generating SVG symbol sprite for 8 icons...');
    const symbols = [];

    ICONS.forEach(({ id, file, fillCurrent }) => {
        const fullPath = path.join(ROOT_DIR, 'node_modules', 'devicon', 'icons', file);
        if (!fs.existsSync(fullPath)) {
            console.error(`Error: Devicon file not found: ${fullPath}`);
            process.exit(1);
        }

        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/<\?xml.*?\?>/gi, '').replace(/<!DOCTYPE.*?>/gi, '').trim();

        // Extract viewBox
        const vbMatch = content.match(/viewBox=["']([^"']+)["']/i);
        const viewBox = vbMatch ? vbMatch[1] : '0 0 128 128';

        // Extract inner children of <svg>
        let inner = content.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>$/i, '').trim();

        if (fillCurrent) {
            // Replace static fill color with currentColor so parent CSS sets the color
            inner = inner.replace(/fill=["']#[0-9a-fA-F]+["']/g, 'fill="currentColor"');
            if (!inner.includes('fill=')) {
                inner = inner.replace(/<path\b/g, '<path fill="currentColor"');
            }
        }

        symbols.push(`    <symbol id="${id}" viewBox="${viewBox}">\n      ${inner}\n    </symbol>`);
    });

    const spriteMarkup = `<!-- SVG Icon Sprite (Replaces Render-Blocking Devicon CDN) -->\n<svg xmlns="http://www.w3.org/2000/svg" style="display: none;" aria-hidden="true">\n${symbols.join('\n')}\n</svg>`;
    return spriteMarkup;
}

function updateIndexHtml() {
    const sprite = generateSprite();
    let html = fs.readFileSync(INDEX_HTML, 'utf8');

    // 1. Remove Devicon CDN stylesheet link
    html = html.replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon[^"']*["']\s*>/i, '');

    // 2. Remove any existing devicon SVG sprite if present
    html = html.replace(/<!-- SVG Icon Sprite \(Replaces Render-Blocking Devicon CDN\) -->[\s\S]*?<\/svg>\n?/i, '');

    // 3. Inject sprite right after <body> tag
    html = html.replace(/(<body[^>]*>)/i, `$1\n    ${sprite}`);

    // 4. Replace <i> icon tags with SVG <use> tags
    html = html.replace(
        /<i\s+class=["']devicon-github-original["'](?:\s+aria-hidden=["']true["'])?\s*><\/i>/g,
        '<svg class="devicon-svg devicon-github-original" width="20" height="20" aria-hidden="true"><use href="#devicon-github-original"></use></svg>'
    );
    html = html.replace(
        /<i\s+class=["']devicon-linkedin-plain["'](?:\s+aria-hidden=["']true["'])?\s*><\/i>/g,
        '<svg class="devicon-svg devicon-linkedin-plain" width="20" height="20" aria-hidden="true"><use href="#devicon-linkedin-plain"></use></svg>'
    );

    fs.writeFileSync(INDEX_HTML, html, 'utf8');
    console.log('[build-devicon-sprite] Successfully updated index.html with inline SVG sprite and <use> tags!');
}

updateIndexHtml();

