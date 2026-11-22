import { expect, test } from 'vitest';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const sourceRoot = fileURLToPath(new URL('../../', import.meta.url));
const inputNames = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml'];
const expectedLock = 'c62cbb6f776cbb7f497da67a9997df05af938a9b2573d0263d72f5a03c5c7569';
const digest = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');

type FixtureManifest = { dependencies: Record<string, string>; scripts?: Record<string, string>; [key: string]: unknown };

function run(command: string, args: string[], cwd: string, input?: string) {
  const result = spawnSync(command, args, {
    cwd, input, encoding: 'utf8', timeout: 45_000, maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, CI: 'true', NO_COLOR: '1', FORCE_COLOR: '0' },
  });
  if (result.error || result.signal || result.status === null) throw Error('Subprocesso indisponivel ou interrompido: ' + command);
  const output = (result.stdout || '') + '\n' + (result.stderr || '');
  const codes = [...new Set(output.match(/ERR_PNPM_[A-Z0-9_]+/g) || [])];
  return { status: result.status, stdout: result.stdout || '', codes };
}

test('R2-03: divergencias sao recusadas e configuracoes sinteticas nao executam', { timeout: 180_000 }, () => {
  expect(process.versions.node).toBe('26.13.1');
  const manager = run('pnpm', ['--version'], sourceRoot);
  expect(manager.status).toBe(0);
  expect(manager.stdout.trim()).toBe('12.9.1');
  const original = inputNames.map(name => ({ name, sha256: digest(join(sourceRoot, name)) }));
  expect(digest(join(sourceRoot, 'pnpm-lock.yaml'))).toBe(expectedLock);
  const root = mkdtempSync(join(process.env.RUNNER_TEMP || tmpdir(), 'kit04-r2-negative-'));
  const fixture = (name: string) => {
    const dir = join(root, name);
    mkdirSync(dir);
    for (const input of inputNames) copyFileSync(join(sourceRoot, input), join(dir, input));
    return dir;
  };
  const installArgs = ['install', '--engine-strict', '--offline', '--frozen-lockfile', '--ignore-scripts', '--ignore-pnpmfile'];
  const configCases: { format: string; lifecycleIgnored: boolean; pnpmfileIgnored: boolean }[] = [];
  try {
    const tampered = fixture('tampered-lock');
    const checksum = expectedLock + '  pnpm-lock.yaml\n';
    expect(run('sha256sum', ['--check', '--status'], tampered, checksum).status).toBe(0);
    appendFileSync(join(tampered, 'pnpm-lock.yaml'), '\n# synthetic R2-03 tamper\n');
    expect(run('sha256sum', ['--check', '--status'], tampered, checksum).status).toBe(1);

    const mismatch = fixture('manifest-mismatch');
    const changed: FixtureManifest = JSON.parse(readFileSync(join(mismatch, 'package.json'), 'utf8'));
    expect(changed.dependencies.lit).toBe('3.3.3');
    changed.dependencies.lit = '0.0.0-r2-negative';
    writeFileSync(join(mismatch, 'package.json'), JSON.stringify(changed, null, 2) + '\n');
    const rejected = run('pnpm', installArgs, mismatch);
    expect(rejected.status, JSON.stringify({ codes: rejected.codes })).not.toBe(0);
    expect(rejected.codes).toContain('ERR_PNPM_OUTDATED_LOCKFILE');
    expect(digest(join(mismatch, 'pnpm-lock.yaml'))).toBe(expectedLock);

    for (const format of ['mjs', 'cjs']) {
      const dir = fixture('ignored-config-' + format);
      const manifest: FixtureManifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      manifest.scripts = { ...manifest.scripts, preinstall: `node --input-type=module -e "import fs from 'node:fs'; fs.writeFileSync('lifecycle-ran', 'synthetic');"` };
      writeFileSync(join(dir, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
      const pnpmfile = format === 'mjs'
        ? `import fs from 'node:fs'; fs.writeFileSync(new URL('pnpmfile-ran', import.meta.url), 'synthetic'); export const hooks = {};\n`
        : `const fs = require('node:fs'); fs.writeFileSync(require('node:path').join(__dirname, 'pnpmfile-ran'), 'synthetic'); module.exports = { hooks: {} };\n`;
      writeFileSync(join(dir, '.pnpmfile.' + format), pnpmfile);
      const installed = run('pnpm', installArgs, dir);
      expect(installed.status, JSON.stringify({ format, codes: installed.codes })).toBe(0);
      expect(existsSync(join(dir, 'lifecycle-ran'))).toBe(false);
      expect(existsSync(join(dir, 'pnpmfile-ran'))).toBe(false);
      expect(digest(join(dir, 'pnpm-lock.yaml'))).toBe(expectedLock);
      configCases.push({ format, lifecycleIgnored: true, pnpmfileIgnored: true });
    }
    for (const input of original) expect(digest(join(sourceRoot, input.name))).toBe(input.sha256);
    console.log('R2_03_NEGATIVE_SUMMARY=' + JSON.stringify({
      commit: process.env.GITHUB_SHA || null, node: process.version, pnpm: '12.9.1',
      platform: process.platform, architecture: process.arch,
      lockTamperRejectedByChecksum: true,
      manifestMismatchRejectedByFrozenInstall: true,
      rejectionCode: 'ERR_PNPM_OUTDATED_LOCKFILE', configCases,
      originalInputsUnchanged: true, fixturesAreSynthetic: true,
      usesWarmStore: true, offlineInstallFlag: true, coldOfflineSetupVerified: false,
      releaseAuthorized: false,
    }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
