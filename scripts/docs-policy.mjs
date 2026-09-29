import { createHash } from 'node:crypto';

export function contentHash(content) {
  return createHash('sha256').update(content.replaceAll('\r\n', '\n').trim()).digest('hex');
}

export function checkInventory(actual, expected) {
  const a = new Set(actual);
  const e = new Set(expected);
  return [
    ...actual.filter(path => !e.has(path)).map(path => `Unlisted: ${path}`),
    ...expected.filter(path => !a.has(path)).map(path => `Missing: ${path}`)
  ];
}

export function checkTranslation(path, en, zh, reviewed) {
  if (!reviewed || reviewed.en !== contentHash(en) || reviewed.zh !== contentHash(zh)) {
    return [`Translation review required: ${path}`];
  }
  return [];
}
