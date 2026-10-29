const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.resolve(__dirname, '../fonts');
if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const fontMap = {
    'poppins-latin-400-normal.woff2': 'poppins-400.woff2',
    'poppins-latin-500-normal.woff2': 'poppins-500.woff2',
    'poppins-latin-600-normal.woff2': 'poppins-600.woff2',
    'poppins-latin-700-normal.woff2': 'poppins-700.woff2',
    'poppins-latin-800-normal.woff2': 'poppins-800.woff2',
    'space-grotesk-latin-500-normal.woff2': 'space-grotesk-500.woff2',
    'space-grotesk-latin-600-normal.woff2': 'space-grotesk-600.woff2',
    'space-grotesk-latin-700-normal.woff2': 'space-grotesk-700.woff2',
};

let totalBytes = 0;
console.log('Copying latin woff2 fonts to /fonts:');

for (const [srcName, destName] of Object.entries(fontMap)) {
    const pkg = srcName.startsWith('poppins') ? '@fontsource/poppins' : '@fontsource/space-grotesk';
    const srcPath = path.resolve(__dirname, `../node_modules/${pkg}/files/${srcName}`);
    const destPath = path.resolve(FONTS_DIR, destName);
    
    fs.copyFileSync(srcPath, destPath);
    const size = fs.statSync(destPath).size;
    totalBytes += size;
    console.log(`  ✓ ${destName} (${(size / 1024).toFixed(1)} KB)`);
}

console.log(`Total self-hosted fonts: ${(totalBytes / 1024).toFixed(1)} KB (${totalBytes} bytes)`);
