import assert from 'node:assert/strict';
import test from 'node:test';
import { checkInventory, checkTranslation, contentHash } from '../scripts/docs-policy.mjs';

test('an unlisted Markdown page must not become a published route', () => {
  const errors = checkInventory(['index.md', 'superpowers/specs/private.md'], ['index.md']);
  assert.ok(errors.some(error => error.includes('superpowers/specs/private.md')));
});

test('both language versions must exist', () => {
  const errors = checkInventory(['guide/auth.md'], ['guide/auth.md', 'zh/guide/auth.md']);
  assert.ok(errors.some(error => error.includes('Missing: zh/guide/auth.md')));
});

test('changing either language invalidates translation review', () => {
  const en = '# Settings\nCurrent behavior';
  const zh = '# 设置\n当前行为';
  const reviewed = { en: contentHash(en), zh: contentHash(zh) };
  assert.deepEqual(checkTranslation('settings', en, zh, reviewed), []);
  assert.equal(checkTranslation('settings', `${en}\nChanged`, zh, reviewed).length, 1);
  assert.equal(checkTranslation('settings', en, `${zh}\n已修改`, reviewed).length, 1);
});

test('line ending changes do not invalidate translation review', () => {
  assert.equal(contentHash('# Title\r\nText\r\n'), contentHash('# Title\nText\n'));
});
