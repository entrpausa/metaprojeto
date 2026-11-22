import { expect, test } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recoverable, scanHTML } from '../../packages/core/core.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sha256 = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
function compiler(args: string[]) {
  const r = spawnSync('pnpm', ['exec', 'tsc', ...args], {
    cwd: root, encoding: 'utf8', timeout: 60_000, maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  });
  if (r.error || r.signal || r.status === null) throw Error('Compilador indisponivel ou interrompido');
  return { status: r.status, output: (r.stdout || '') + '\n' + (r.stderr || '') };
}

test('R2-03: classificar somente a amostra AIX por restricao de plataforma', () => {
  const file = join(root, 'pnpm-lock.yaml');
  expect(sha256(file)).toBe('c62cbb6f776cbb7f497da67a9997df05af938a9b2573d0263d72f5a03c5c7569');
  const lock = readFileSync(file, 'utf8');
  const marker = "\n  '@typescript/typescript-aix-ppc64@7.0.2':\n";
  const start = lock.indexOf(marker);
  if (start < 0) throw Error('Registro da amostra ausente; revisar, nao inferir pelo nome');
  const rest = lock.slice(start + marker.length);
  const end = rest.indexOf('\n\n');
  if (end < 0) throw Error('Formato da amostra mudou; revisao necessaria');
  const block = rest.slice(0, end);
  expect(block).toContain('    os: [aix]');
  expect(block).toContain('    cpu: [ppc64]');
  expect(block).toContain('resolution: {integrity: sha512-');
  const excludedByOS = process.platform !== 'aix';
  const excludedByCPU = process.arch !== 'ppc64';
  console.log('R2_03_PLATFORM_SAMPLE=' + JSON.stringify({
    commit: process.env.GITHUB_SHA || null,
    package: '@typescript/typescript-aix-ppc64', version: '7.0.2',
    requiredOS: ['aix'], requiredCPU: ['ppc64'],
    runnerOS: process.platform, runnerCPU: process.arch,
    classification: excludedByOS || excludedByCPU ? 'not_applicable_to_current_runner' : 'needs_materialization_review',
    excludedByOS, excludedByCPU, evidenceSource: 'pinned_lockfile_metadata',
    manifestInspected: false, archiveVerified: false, licenseReviewed: false,
    otherMissingEntriesReviewed: 0, rawInventoryCountersChanged: false, releaseAuthorized: false,
  }));
});

test('R2-04: core deve compilar e mutacao de autorizacao deve falhar', { timeout: 180_000 }, () => {
  const version = compiler(['--version']);
  expect(version.status, version.output).toBe(0);
  expect(version.output).toMatch(/Version 7\.0\.2\b/);
  const coreFile = join(root, 'packages/core/core.mjs');
  const configFile = join(root, 'tsconfig.json');
  const contractsFile = join(root, 'packages/contracts/contracts.ts');
  const before = { core: sha256(coreFile), config: sha256(configFile), contracts: sha256(contractsFile) };
  const dir = mkdtempSync(join(root, '.r2-04-typecheck-'));
  const config = join(dir, 'tsconfig.json');
  const source = readFileSync(coreFile, 'utf8');
  const marker = "],status:'recovery_only_not_f3',publicationAuthorized:false};";
  try {
    const options = { allowJs: true, checkJs: true, strict: true, noEmit: true, incremental: false };
    writeFileSync(config, JSON.stringify({ extends: configFile, compilerOptions: options,
      include: [join(root, 'packages/core/**/*.mjs')], exclude: [join(root, 'node_modules')],
    }), { flag: 'wx' });
    const positive = compiler(['--project', config, '--pretty', 'false']);
    expect(positive.status, positive.output).toBe(0);
    expect(source.split(marker)).toHaveLength(2);
    mkdirSync(join(dir, 'packages/core'), { recursive: true });
    mkdirSync(join(dir, 'packages/contracts'), { recursive: true });
    const fixture = join(dir, 'packages/core/core.mjs');
    writeFileSync(join(dir, 'packages/contracts/contracts.ts'), readFileSync(contractsFile), { flag: 'wx' });
    writeFileSync(fixture, source, { flag: 'wx' });
    writeFileSync(config, JSON.stringify({ extends: configFile, compilerOptions: options,
      include: [fixture], exclude: [join(root, 'node_modules')],
    }));
    const control = compiler(['--project', config, '--pretty', 'false']);
    expect(control.status, control.output).toBe(0);
    writeFileSync(fixture, source.replace(marker, marker.replace('publicationAuthorized:false', 'publicationAuthorized:true')));
    const negative = compiler(['--project', config, '--pretty', 'false']);
    expect(negative.status, 'Mutacao critica nao detectada').not.toBe(0);
    expect(negative.output).toMatch(/core\.mjs/);
    expect(negative.output).toMatch(/error TS2322:/);
    expect(sha256(coreFile)).toBe(before.core);
    expect(sha256(configFile)).toBe(before.config);
    expect(sha256(contractsFile)).toBe(before.contracts);
    console.log('R2_04_TYPE_BASELINE=' + JSON.stringify({
      commit: process.env.GITHUB_SHA || null, mode: 'blocking_core_typecheck',
      scope: ['packages/core/**/*.mjs'], checkJs: true, strict: true,
      compilerVersion: '7.0.2', compilerExitCode: positive.status,
      compilerPassedForScope: true, diagnostics: 0, sourceHashes: before,
      originalSourcesUnchanged: true, adaptersAndUINotIncluded: true,
      negativeTypeMutationTestExecuted: true, negativeControlPassed: true,
      negativeMutationRejected: true, negativeCompilerExitCode: negative.status,
      negativeExpectedCode: 2322, coreTypingVerified: true,
      canClaimR204Complete: false, releaseAuthorized: false,
    }));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('R2-04: hash embutido deve ser texto, sem coercao de array', () => {
  const data = JSON.stringify({ source_files: { 'a.txt': 'x' }, source_manifest: { 'a.txt': ['0'.repeat(64)] } });
  const html = '<script id="atelie-source-assets" type="application/json">' + data + '</script>';
  expect(() => recoverable(scanHTML(html))).toThrow('Hash de fonte ausente/inválido');
});
