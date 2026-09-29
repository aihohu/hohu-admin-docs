import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { pagePaths } from '../docs/.vitepress/navigation.mjs';
import { checkInventory } from './docs-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'docs/.vitepress/dist');
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(relative(dist, path).replaceAll('\\', '/'));
  }
  return files;
}
const files = await walk(dist);
const errors = checkInventory(
  files.filter(file => file.endsWith('.html')),
  [...pagePaths.map(file => file.replace(/\.md$/, '.html')), '404.html']
);
for (const file of files) {
  if (/(?:^|\/)(?:specs|plans|reports|prototype|superpowers|\.local|\.tmp)(?:\/|$)/.test(file))
    errors.push(`Private artifact: ${file}`);
}
for (const file of ['LICENSE', 'NOTICE']) {
  const original = await readFile(resolve(root, file), 'utf8');
  const published = await readFile(resolve(dist, 'licenses', `${file}.txt`), 'utf8');
  if (original.replaceAll('\r\n', '\n') !== published.replaceAll('\r\n', '\n'))
    errors.push(`License copy mismatch: ${file}`);
}
if (errors.length) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('Published HTML inventory, local-material exclusion and license copies passed.\n');
}
