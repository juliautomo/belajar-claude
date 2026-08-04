#!/usr/bin/env node
// Lightweight CI check for belajar-claude: no build step, plain HTML/CSS/JS.
// 1. Extracts every inline <script> block from every *.html file and syntax-checks it with `node --check`.
// 2. Syntax-checks every standalone *.js file the same way.
// 3. Verifies every local href="..."/src="..." reference (html/js/css/pdf/png/jpg/svg) points at a file that exists.
// Exits non-zero (fails the CI run) if anything is broken.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const jsFiles = fs.readdirSync(root).filter(f => f.endsWith('.js') && f !== 'ci-check.js');

let failures = 0;
const tmpDir = fs.mkdtempSync('/tmp/ci-check-');

function checkSyntax(code, label) {
  const tmpFile = path.join(tmpDir, label.replace(/[\/\\]/g, '_') + '.js');
  fs.writeFileSync(tmpFile, code);
  try {
    execFileSync('node', ['--check', tmpFile], { stdio: 'pipe' });
  } catch (e) {
    failures++;
    console.error(`\nSYNTAX ERROR in ${label}:`);
    console.error(e.stderr.toString().slice(0, 800));
  }
}

// 1. Inline <script> blocks in every HTML file
for (const file of htmlFiles) {
  const src = fs.readFileSync(file, 'utf8');
  const scripts = [...src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((m, i) => {
    const code = m[1].trim();
    if (!code) return;
    if (/type\s*=\s*["'](application\/ld\+json|application\/json)["']/i.test(m[0])) return;
    checkSyntax(code, `${file} [inline script #${i + 1}]`);
  });
}

// 2. Standalone .js files
for (const file of jsFiles) {
  checkSyntax(fs.readFileSync(file, 'utf8'), file);
}

// 3. Local file references resolve
const refPattern = /(?:href|src)="([a-zA-Z0-9_.\-\/]+\.(?:html|js|css|pdf|png|jpg|jpeg|svg))"/g;
const seen = new Set();
for (const file of htmlFiles) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = refPattern.exec(src))) {
    const ref = m[1];
    if (seen.has(ref)) continue;
    seen.add(ref);
    if (ref.startsWith('http')) continue;
    if (!fs.existsSync(path.join(root, ref))) {
      failures++;
      console.error(`\nBROKEN REFERENCE: "${ref}" (found in ${file}) does not exist`);
    }
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });

if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
} else {
  console.log(`OK — checked ${htmlFiles.length} HTML files, ${jsFiles.length} JS files, ${seen.size} local references. Nothing broken.`);
}
