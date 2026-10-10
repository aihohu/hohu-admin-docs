import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import test from 'node:test';

test(
  'publisher preserves the live site across failures, rollback and concurrent releases',
  {
    skip: process.platform !== 'linux' && 'Production deployment requires Linux',
    timeout: 120000
  },
  () => {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const temporaryRoot = fileURLToPath(new URL('../.local/tests/deployment/', import.meta.url));
    mkdirSync(temporaryRoot, { recursive: true });
    const result = spawnSync('python3', ['-B', 'tests/test_deploy.py'], {
      cwd: root,
      env: { ...process.env, HOHU_DEPLOY_TEST_DIR: temporaryRoot },
      encoding: 'utf8',
      timeout: 110000
    });
    assert.equal(result.status, 0, result.error?.message || result.stderr);
  }
);
