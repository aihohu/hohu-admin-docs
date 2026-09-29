import { readFile, readdir, writeFile, lstat } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { guidePaths, pagePaths } from '../docs/.vitepress/navigation.mjs';
import { checkInventory, checkTranslation, contentHash } from './docs-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(root, 'docs');
const ledgerPath = resolve(root, 'docs/.vitepress/translations.json');

async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.vitepress') continue;
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink in public source: ${path}`);
    if (entry.isDirectory()) result.push(...(await markdownFiles(path)));
    else if (entry.name.endsWith('.md')) result.push(relative(docs, path).replaceAll('\\', '/'));
  }
  return result;
}

async function readPage(path) {
  return readFile(resolve(docs, path), 'utf8');
}

async function main() {
  const files = await markdownFiles(docs);
  const errors = checkInventory(files, pagePaths);
  if (new Set(pagePaths).size !== pagePaths.length) errors.push('Duplicate route in navigation');
  let ledger = {};
  try {
    ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const accept = process.argv.slice(2);
  if (accept.length && accept[0] !== '--accept')
    throw new Error('Usage: check-docs.mjs [--accept <guide-path|index> ...]');
  if (accept[0] === '--accept' && accept.length < 2) throw new Error('Select explicitly reviewed page pairs');
  const selected = new Set(accept.slice(1));
  const pairs = ['index', ...guidePaths];
  for (const path of selected) if (!pairs.includes(path)) errors.push(`Unknown translation pair: ${path}`);
  for (const path of pairs) {
    const enPath = path === 'index' ? 'index.md' : `guide/${path}.md`;
    const zhPath = `zh/${enPath}`;
    if (!files.includes(enPath) || !files.includes(zhPath)) continue;
    const en = await readPage(enPath);
    const zh = await readPage(zhPath);
    if (selected.has(path)) ledger[path] = { en: contentHash(en), zh: contentHash(zh) };
    errors.push(...checkTranslation(path, en, zh, ledger[path]));
  }
  for (const path of Object.keys(ledger)) if (!pairs.includes(path)) errors.push(`Stale translation record: ${path}`);
  for (const file of files) {
    const content = await readPage(file);
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter || !/^title:\s*\S/m.test(frontmatter[1]) || !/^description:\s*\S/m.test(frontmatter[1])) {
      errors.push(`Missing title/description: ${file}`);
    }
    const prose = content.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    for (const match of prose.matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
      const target = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
      const raw = decodeURIComponent(target.split(/[?#]/)[0]);
      if (!raw) continue;
      const base = raw.startsWith('/') ? docs : dirname(resolve(docs, file));
      const path = resolve(base, raw.replace(/^\//, ''));
      const rel = relative(docs, path).replaceAll('\\', '/');
      if (
        rel.startsWith('../') ||
        /(?:^|\/)(?:\.local|\.tmp|specs|plans|reports|prototype|superpowers)(?:\/|$)/.test(rel)
      ) {
        errors.push(`Private/outside link: ${file} -> ${target}`);
        continue;
      }
      const candidates = [path, `${path}.md`, resolve(path, 'index.md'), resolve(docs, 'public', rel)];
      const exists = await Promise.all(
        candidates.map(async candidate => {
          try {
            return (await lstat(candidate)).isFile();
          } catch {
            return false;
          }
        })
      );
      if (!exists.some(Boolean)) errors.push(`Missing link: ${file} -> ${target}`);
    }
  }
  const tracked = execFileSync('git', ['ls-files', '-z'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).split('\0');
  for (const file of tracked) {
    if (/^(?:\.local|\.tmp|\.playwright-mcp|\.superpowers)\//.test(file))
      errors.push(`Tracked working material: ${file}`);
  }
  if (selected.size) await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  if (errors.length) {
    process.stderr.write(`${errors.join('\n')}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Checked ${files.length} pages and ${pairs.length} bilingual pairs.\n`);
  }
}

await main();
