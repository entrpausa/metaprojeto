import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {auditImport, gitBlobId} from '../tools/audit-kit04.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'kit04-audit-test-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  await fs.mkdir(path.join(root, 'nested'));
  const payload = [['readme.md', Buffer.from('exemplo\n')], ['nested/data.bin', Buffer.from([0, 255, 13, 10])]];
  for (const [name, bytes] of payload) await fs.writeFile(path.join(root, name), bytes);
  const manifest = {status: 'blocked_candidate', algorithm: 'sha256', excludesSelf: true, notASignature: true, files: payload.map(([name, bytes]) => ({path: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')}))};
  async function save() {
    const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
    await fs.writeFile(path.join(root, 'MANIFEST.json'), bytes);
    return {manifestBlob: gitBlobId(bytes), expectedCount: manifest.files.length};
  }
  return {root, manifest, save, options: await save()};
}
test('Audita texto e binário sem reinterpretar bytes', async t => {
  const f = await fixture(t), result = await auditImport(f.root, f.options);
  assert.equal(result.payloadFilesChecked, 2); assert.equal(result.filesPresent, 3);
  assert.equal(result.integrity, 'matched'); assert.equal(result.releaseApproved, false); assert.equal(result.isSignature, false);
});
test('Recusa alteração de conteúdo com mesmo tamanho', async t => {
  const f = await fixture(t); await fs.writeFile(path.join(f.root, 'readme.md'), 'alterad\n');
  await assert.rejects(() => auditImport(f.root, f.options), /SHA-256/);
});
test('Recusa tamanho diferente', async t => {
  const f = await fixture(t); await fs.writeFile(path.join(f.root, 'readme.md'), 'x');
  await assert.rejects(() => auditImport(f.root, f.options), /Tamanho/);
});
test('Recusa arquivo ausente', async t => {
  const f = await fixture(t); await fs.rm(path.join(f.root, 'readme.md'));
  await assert.rejects(() => auditImport(f.root, f.options), /Inventário/);
});
test('Recusa arquivo extra', async t => {
  const f = await fixture(t); await fs.writeFile(path.join(f.root, 'extra.txt'), 'x');
  await assert.rejects(() => auditImport(f.root, f.options), /Inventário/);
});
test('Recusa alteração do próprio manifesto', async t => {
  const f = await fixture(t); f.manifest.status = 'approved'; await f.save();
  await assert.rejects(() => auditImport(f.root, f.options), /referência fixada/);
});
test('Recusa caminho fora da raiz mesmo com manifesto de fixture autorizado', async t => {
  const f = await fixture(t); f.manifest.files[0].path = '../outside'; const options = await f.save();
  await assert.rejects(() => auditImport(f.root, options), /Caminho/);
});
test('Recusa caminho duplicado', async t => {
  const f = await fixture(t); f.manifest.files[1] = {...f.manifest.files[0]}; const options = await f.save();
  await assert.rejects(() => auditImport(f.root, options), /duplicado/);
});
test('Recusa colisão de maiúsculas', async t => {
  const f = await fixture(t); f.manifest.files[1].path = 'README.md'; const options = await f.save();
  await assert.rejects(() => auditImport(f.root, options), /colisão/);
});
test('Recusa symlink no conteúdo', async t => {
  const f = await fixture(t); await fs.symlink('readme.md', path.join(f.root, 'link.txt'));
  await assert.rejects(() => auditImport(f.root, f.options), /Link simbólico/);
});
test('Recusa raiz que seja symlink', async t => {
  const f = await fixture(t), link = f.root + '-link';
  t.after(() => fs.rm(link, {force: true})); await fs.symlink(f.root, link);
  await assert.rejects(() => auditImport(link, f.options), /Raiz/);
});
test('Recusa hash malformado', async t => {
  const f = await fixture(t); f.manifest.files[0].sha256 = 'abc'; const options = await f.save();
  await assert.rejects(() => auditImport(f.root, options), /Registro/);
});
test('Recusa quantidade divergente', async t => {
  const f = await fixture(t);
  await assert.rejects(() => auditImport(f.root, {...f.options, expectedCount: 3}), /Quantidade/);
});
test('Recusa metadados que incluam o próprio manifesto no payload', async t => {
  const f = await fixture(t); f.manifest.excludesSelf = false; const options = await f.save();
  await assert.rejects(() => auditImport(f.root, options), /Metadados/);
});
test('Recusa JSON inválido mesmo com bytes de fixture autorizados', async t => {
  const f = await fixture(t), bytes = Buffer.from('{invalid'); await fs.writeFile(path.join(f.root, 'MANIFEST.json'), bytes);
  await assert.rejects(() => auditImport(f.root, {...f.options, manifestBlob: gitBlobId(bytes)}), SyntaxError);
});

test('Identificador do manifesto coincide com referencia produzida pelo Git', () => {
  assert.equal(gitBlobId(Buffer.from('abc')), 'f2ba8f84ab5c1bce84a7b441cb1959cfc7093b7f');
});
