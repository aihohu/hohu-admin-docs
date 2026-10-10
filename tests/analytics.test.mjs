import assert from 'node:assert/strict';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { analyticsBootstrap, measurementId } from '../docs/.vitepress/analytics.mjs';
import { actionEvent, guideEvent, trackAction } from '../docs/.vitepress/theme/composables/analytics.ts';

test('events use fixed identifiers and canonical paths without query or fragment data', () => {
  assert.deepEqual(actionEvent('cli_project', '/zh/?private=value#start'), {
    name: 'command_copy',
    params: { action_id: 'cli_project', page_path: '/zh/', locale: 'zh-CN' }
  });
  assert.equal(actionEvent('unknown', '/'), null);
  assert.equal(actionEvent('cli_start', '/private/path'), null);
  assert.equal(actionEvent('ai_project', '/').name, 'prompt_copy');
  assert.equal(actionEvent('demo', '/').name, 'demo_click');
});

test('guide views cover direct and translated entries but ignore unrelated pages', () => {
  assert.deepEqual(guideEvent('zh/guide/cli/skills.md'), {
    name: 'guide_view',
    params: { guide_id: 'cli/skills', page_path: '/zh/guide/cli/skills.html', locale: 'zh-CN' }
  });
  assert.equal(guideEvent('index.md'), null);
  assert.equal(guideEvent('guide/backend/error-code.md'), null);
});

test('analytics is safe for SSR, previews and blocked SDKs and only dispatches on the official origin', () => {
  const original = globalThis.window;
  const events = [];
  try {
    delete globalThis.window;
    assert.doesNotThrow(() => trackAction('demo'));
    for (const origin of ['http://localhost:5173', 'https://preview.hohu.org', 'https://hohu.org']) {
      globalThis.window = { location: { origin, pathname: '/zh/' }, gtag: (...args) => events.push(args) };
      trackAction('demo');
    }
    assert.equal(events.length, 1);
    assert.equal(events[0][0], 'event');
    assert.equal(events[0][1], 'demo_click');
    globalThis.window.gtag = () => {
      throw new Error('blocked');
    };
    assert.doesNotThrow(() => trackAction('demo'));
    delete globalThis.window.gtag;
    assert.doesNotThrow(() => trackAction('demo'));
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});

test('GA bootstrap never loads the production tag on local or preview origins', () => {
  for (const origin of ['http://localhost:5173', 'https://preview.hohu.org', 'https://hohu.org']) {
    const scripts = [];
    const browser = { location: { origin } };
    runInNewContext(analyticsBootstrap, {
      window: browser,
      document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }
    });
    if (origin === 'https://hohu.org') {
      assert.equal(scripts.length, 1);
      assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
      assert.equal(browser.dataLayer[1][0], 'config');
      assert.equal(browser.dataLayer[1][1], measurementId);
    } else {
      assert.equal(scripts.length, 0);
      assert.equal(browser.dataLayer, undefined);
    }
  }
});
