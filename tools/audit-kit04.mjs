import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const ORIGINAL_COMMIT = '7c3c9a57beab847bf7a08565d2b7a185ee4c90f4';
export const ORIGINAL_MANIFEST_BLOB = '35c9b93110b5c8d651576a0cb1b061abb182e64d';
export function gitBlobId(bytes) {
  return createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
}
function relativeName(value) {
  if (typeof value !== 'string' || !value || value.length > 512 || /[\u0000-\u001f\\:]/.test(value) || value.startsWith('/')) throw Error('Caminho de manifesto inválido');
  if (value.split('/').some(part => !part || part === '.' || part === '..')) throw Error('Caminho de manifesto inseguro');
  return value;
}
export async function auditImport(root, {manifestBlob = ORIGINAL_MANIFEST_BLOB, expectedCount = 57} = {}) {
  root = path.resolve(root);
  const rootStat = await fs.lstat(root);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) throw Error('Raiz deve ser diretório real');
  const observed = [];
  let visited = 0;
  async function walk(directory, prefix = '', depth = 0) {
    if (depth > 32) throw Error('Profundidade de auditoria excedida');
    for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
      if (++visited > 2048) throw Error('Árvore de auditoria excedida');
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      relativeName(relative);
      const full = path.join(directory, entry.name);
      const stat = await fs.lstat(full);
      if (stat.isSymbolicLink()) throw Error(`Link simbólico bloqueado: ${relative}`);
      if (stat.isDirectory()) await walk(full, relative, depth + 1);
      else if (stat.isFile()) observed.push(relative);
      else throw Error(`Tipo de arquivo bloqueado: ${relative}`);
      if (observed.length > 1024) throw Error('Árvore de auditoria excedida');
    }
  }
  await walk(root);
  if (!observed.includes('MANIFEST.json')) throw Error('MANIFEST.json ausente');
  const manifestStat = await fs.lstat(path.join(root, 'MANIFEST.json'));
  if (!manifestStat.isFile() || manifestStat.size > 65536) throw Error('Manifesto excedido ou irregular');
  const manifestBytes = await fs.readFile(path.join(root, 'MANIFEST.json'));
  if (gitBlobId(manifestBytes) !== manifestBlob) throw Error('Manifesto diferente da referência fixada');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (manifest.algorithm !== 'sha256' || manifest.excludesSelf !== true || manifest.notASignature !== true || manifest.status !== 'blocked_candidate') throw Error('Metadados do manifesto inconsistentes');
  if (!Array.isArray(manifest.files) || manifest.files.length !== expectedCount) throw Error('Quantidade do manifesto divergente');
  const expected = new Set(['MANIFEST.json']), folded = new Set(['manifest.json']);
  for (const item of manifest.files) {
    const name = relativeName(item.path), fold = name.toLowerCase();
    if (folded.has(fold)) throw Error(`Caminho duplicado ou colisão: ${name}`);
    if (!Number.isSafeInteger(item.bytes) || item.bytes < 0 || !/^[a-f0-9]{64}$/.test(item.sha256)) throw Error(`Registro inválido: ${name}`);
    expected.add(name); folded.add(fold);
  }
  const actual = new Set(observed);
  const missing = [...expected].filter(name => !actual.has(name));
  const extra = observed.filter(name => !expected.has(name));
  if (missing.length || extra.length) throw Error(`Inventário divergente; ausentes=${missing.join(',')}; extras=${extra.join(',')}`);
  let bytesChecked = 0;
  for (const item of manifest.files) {
    const full = path.join(root, ...item.path.split('/'));
    if ((await fs.lstat(full)).size !== item.bytes) throw Error(`Tamanho divergente: ${item.path}`);
    const bytes = await fs.readFile(full);
    if (bytes.length !== item.bytes) throw Error(`Tamanho divergente: ${item.path}`);
    if (createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw Error(`SHA-256 divergente: ${item.path}`);
    bytesChecked += bytes.length;
  }
  return {schema: 'kit04-import-audit/1', scope: 'original_candidate_import_only', filesPresent: observed.length, payloadFilesChecked: manifest.files.length, bytesChecked, manifestBlob, manifestExcludedFromPayload: true, integrity: 'matched', isSignature: false, releaseApproved: false};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw Error('Uso: node tools/audit-kit04.mjs PASTA_DO_CANDIDATO_ORIGINAL');
    console.log(JSON.stringify(await auditImport(process.argv[2]), null, 2));
  } catch (error) {
    console.error(`AUDITORIA BLOQUEADA: ${error.message}`);
    process.exitCode = 1;
  }
}
