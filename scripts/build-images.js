/**
 * Responsive Image Generator
 * Generates 480w and 800w WebP variants (quality 75) for mobile and tablet screens.
 * Preserves original images.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'images');

const TARGET_IMAGES = [
    // Hero & About images
    'about-me-polished.webp',
    'about-robot.webp',
    'about-sarah.webp',
    'hero-portrait-default.webp',
    'hero-portrait-halo.webp',
    'hero-mobile-backdrop.webp',
    'hero-video-poster.webp',

    // Projects
    'projects/project-ann-neural.webp',
    'projects/project-clustering-ml.webp',
    'projects/project-cpp-calculator.webp',
    'projects/project-cv-opencv.webp',
    'projects/project-ml-classification.webp',
    'projects/project-mysql-database.webp',

    // Certificates
    'certificates/cert-cib-internship.webp',
    'certificates/cert-nti-ml.webp',
    'certificates/cert-sprints-microsoft.webp'
];

async function generateVariants() {
    console.log('🖼️ [build-images] Starting responsive image generation (480w & 800w @ quality 75)...');
    const report = [];

    for (const relPath of TARGET_IMAGES) {
        const fullWebpPath = path.join(IMAGES_DIR, relPath);
        // Prefer corresponding .png as input if available for max source quality, otherwise original .webp
        const pngCandidate = fullWebpPath.replace(/\.webp$/i, '.png');
        const inputPath = fs.existsSync(pngCandidate) ? pngCandidate : fullWebpPath;

        if (!fs.existsSync(inputPath)) {
            console.warn(`  ⚠️ Source not found: ${relPath}`);
            continue;
        }

        const originalSize = fs.statSync(fullWebpPath).size;
        const dir = path.dirname(fullWebpPath);
        const ext = path.extname(relPath);
        const baseName = path.basename(relPath, ext);

        const out480Path = path.join(dir, `${baseName}-480.webp`);
        const out800Path = path.join(dir, `${baseName}-800.webp`);

        // Generate 480w variant
        await sharp(inputPath)
            .resize({ width: 480, withoutEnlargement: true })
            .webp({ quality: 75, effort: 6 })
            .toFile(out480Path);

        // Generate 800w variant
        await sharp(inputPath)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 75, effort: 6 })
            .toFile(out800Path);

        const size480 = fs.statSync(out480Path).size;
        const size800 = fs.statSync(out800Path).size;

        report.push({
            image: relPath,
            originalKb: (originalSize / 1024).toFixed(1),
            kb800: (size800 / 1024).toFixed(1),
            kb480: (size480 / 1024).toFixed(1),
            savingsPercent: (((originalSize - size480) / originalSize) * 100).toFixed(1)
        });
    }

    console.log('\n📊 Responsive Images Report:');
    console.table(report);

    // Save report to markdown
    let md = '# Responsive Images Optimization Report (Task 7)\n\n';
    md += 'Generated variants at 480w and 800w (WebP quality 75) using `sharp`.\n\n';
    md += '| Image | Original WebP | 800w Variant | 480w Variant (Mobile) | Mobile Savings |\n';
    md += '| :--- | :--- | :--- | :--- | :--- |\n';
    report.forEach(r => {
        md += `| \`${r.image}\` | ${r.originalKb} KB | ${r.kb800} KB | **${r.kb480} KB** | **-${r.savingsPercent}%** |\n`;
    });
    fs.writeFileSync(path.join(ROOT_DIR, 'docs', 'perf-images.md'), md, 'utf8');
    console.log('📝 Saved docs/perf-images.md');
}

if (require.main === module) {
    generateVariants().catch(err => {
        console.error('❌ [build-images] Failed:', err);
        process.exit(1);
    });
}

module.exports = { generateVariants };

