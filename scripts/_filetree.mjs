// Builds the JSON file tree for Vercel's deploy_to_vercel tool.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INCLUDE_DIRS = ['src', 'public', 'scripts'];
const INCLUDE_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.mjs',
  'postcss.config.mjs', 'eslint.config.mjs', '.env.example', 'README.md', '.gitignore',
];
const BINARY = new Set(['.png', '.woff2', '.jpg', '.ico', '.webp']);

const out = [];
const add = (rel) => {
  const ext = path.extname(rel);
  const buf = fs.readFileSync(path.join(ROOT, rel));
  if (BINARY.has(ext)) out.push({ file: rel, data: buf.toString('base64'), encoding: 'base64' });
  else out.push({ file: rel, data: buf.toString('utf8') });
};
const walk = (dir) => {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) walk(rel);
    else if (!e.name.startsWith('_')) add(rel);
  }
};
INCLUDE_FILES.forEach((f) => fs.existsSync(f) && add(f));
INCLUDE_DIRS.forEach(walk);

fs.writeFileSync('/tmp/filetree.json', JSON.stringify(out));
const bytes = JSON.stringify(out).length;
console.log(`${out.length} files, ${(bytes / 1024).toFixed(0)} KB of JSON`);
for (const f of out) console.log(`  ${String(Math.round(f.data.length/1024)).padStart(4)} KB  ${f.file}`);
