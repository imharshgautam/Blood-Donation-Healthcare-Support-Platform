const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const pagesDir = path.join(rootDir, 'pages');
const assetsDir = path.join(rootDir, 'assets');

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.cpSync(pagesDir, publicDir, { recursive: true });
fs.cpSync(assetsDir, path.join(publicDir, 'assets'), { recursive: true });

console.log('Built static assets into public/');
