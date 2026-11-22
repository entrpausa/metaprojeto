import { expect, test } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    excludedByOS, excludedByCPU,
    evidenceSource: 'pinned_lockfile_metadata',
    manifestInspected: false, archiveVerified: false, licenseReviewed: false,
    otherMissingEntriesReviewed: 0, rawInventoryCountersChanged: false,
    releaseAuthorized: false,
  }));
});

// Diagnostic baseline only: a valid probe may report compiler errors.
// Passing this test is not passing the core typecheck or accepting R2-04.
test('R2-04: registrar diagnostico real do core sem homologar tipagem', { timeout: 90_000 }, () => {
  const version = compiler(['--version']);
  expect(version.status).toBe(0);
  expect(version.output).toMatch(/Version 7\.0\.2\b/);
  const coreFile = join(root, 'packages/core/core.mjs');
  const configFile = join(root, 'tsconfig.json');
  const before = { core: sha256(coreFile), config: sha256(configFile) };
  const dir = mkdtempSync(join(root, '.r2-04-typeprobe-'));
  const config = join(dir, 'tsconfig.json');
  try {
    writeFileSync(config, JSON.stringify({
      extends: configFile,
      compilerOptions: { allowJs: true, checkJs: true, noEmit: true, incremental: false },
      include: [join(root, 'packages/core/**/*.mjs')],
      exclude: [join(root, 'node_modules')],
    }, null, 2) + '\n', { flag: 'wx' });
    const result = compiler(['--project', config, '--noEmit', '--pretty', 'false']);
    const codes = [...result.output.matchAll(/error TS(\d+):/g)].map(m => Number(m[1]));
    const infrastructure = new Set([18003, 5023, 5058, 5083, 2688, 6053]);
    if (codes.some(code => infrastructure.has(code))) throw Error('Falha na infraestrutura da sonda de tipos: ' + JSON.stringify([...new Set(codes)]));
    if (result.status !== 0 && codes.length === 0) throw Error('Falha do compilador sem diagnostico TS reconhecido');
    const counts: Record<string, number> = {};
    for (const code of codes) counts[String(code)] = (counts[String(code)] || 0) + 1;
    expect(sha256(coreFile)).toBe(before.core);
    expect(sha256(configFile)).toBe(before.config);
    console.log('R2_04_TYPE_BASELINE=' + JSON.stringify({
      commit: process.env.GITHUB_SHA || null, mode: 'diagnostic_only',
      scope: ['packages/core/**/*.mjs'], checkJs: true, strictInherited: true,
      compilerVersion: '7.0.2', compilerExitCode: result.status,
      compilerPassedForScope: result.status === 0, diagnostics: codes.length, diagnosticsByCode: counts,
      sourceHashes: before, originalSourcesUnchanged: true,
      adaptersAndUINotIncluded: true, negativeTypeMutationTestExecuted: false,
      coreTypingVerified: false, canClaimR204Complete: false, releaseAuthorized: false,
    }));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
