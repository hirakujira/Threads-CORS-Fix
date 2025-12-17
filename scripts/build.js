#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const BROWSERS = ['chrome', 'firefox'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${path.basename(src)}`);
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildBrowser(browser) {
  console.log(`\nBuilding ${browser}...`);

  const distDir = path.join(DIST, browser);
  cleanDir(distDir);
  ensureDir(distDir);

  // Copy browser-specific manifest
  const manifestSrc = path.join(SRC, 'manifests', `${browser}.json`);
  copyFile(manifestSrc, path.join(distDir, 'manifest.json'));

  // Copy shared rules
  copyFile(path.join(SRC, 'shared', 'rules.json'), path.join(distDir, 'rules.json'));

  // Copy icons
  console.log(`  ✓ icons/`);
  copyDir(path.join(SRC, 'shared', 'icons'), path.join(distDir, 'icons'));

  console.log(`✅ ${browser} → dist/${browser}/`);
}

function createZip(browser) {
  const distDir = path.join(DIST, browser);
  const zipName = `threads-cors-fix-${browser}.zip`;
  const zipPath = path.join(DIST, zipName);

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  console.log(`\nPackaging ${browser}...`);

  try {
    // Get list of files to zip
    const files = fs.readdirSync(distDir);

    if (process.platform === 'win32') {
      // Windows: use PowerShell Compress-Archive
      execFileSync('powershell', [
        '-Command',
        `Compress-Archive -Path '${distDir}/*' -DestinationPath '${zipPath}'`
      ], { stdio: 'pipe' });
    } else {
      // Unix: use zip command with explicit file list
      execFileSync('zip', ['-r', `../${zipName}`, ...files], {
        cwd: distDir,
        stdio: 'pipe'
      });
    }
    console.log(`✅ ${zipName}`);
  } catch (error) {
    console.error(`❌ Failed to create ${zipName}:`, error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'clean') {
  console.log('Cleaning dist/...');
  cleanDir(DIST);
  console.log('✅ Clean complete');
  process.exit(0);
}

if (command === 'zip') {
  BROWSERS.forEach(createZip);
  console.log('\n✅ All packages created in dist/');
  process.exit(0);
}

if (command && BROWSERS.includes(command)) {
  buildBrowser(command);
} else {
  BROWSERS.forEach(buildBrowser);
  console.log('\n✅ Build complete! Run `npm run package` to create zip files.');
}
