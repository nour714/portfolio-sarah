/**
 * Plain-Node JS Bundler & Minifier using esbuild
 */

const { runBuild } = require('./build.js');

runBuild().catch((err) => {
    console.error('JS Build failed:', err);
    process.exit(1);
});
