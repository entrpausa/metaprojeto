import fs from 'node:fs/promises';import {constants}from'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {webcrypto} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {POLICY,analyze,canonical,makePlan,sha256,createJob,validateJob,scanHTML,recoverable,verifyRecovery,parseJSON,safePath} from '../packages/core/core.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const args=process.argv.slice(2),command=args.shift(),arg=(key)=>{const i=args.indexOf('--'+key);return i<0?null:args[i+1];};
const base=fileURLToPath(new URL('../',import.meta.url));
async function freshJSON(file,value){await fs.writeFile(file,JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
async function readProject(input){
 if(!input)throw Error('--input é obrigatório');const abs=path.resolve(input),first=await fs.lstat(abs);if(first.isSymbolicLink())throw Error('Symlink de entrada bloqueado');const files=[];let total=0,visited=0;const realInput=await fs.realpath(abs);
 async function walk(full,rel){if(++visited>1024||rel.split('/').length>24)throw Error('Árvore de diretórios excedida');const stat=await fs.lstat(full);if(stat.isSymbolicLink())throw Error('Symlink bloqueado');if(stat.isDirectory()){
  for(const e of await fs.readdir(full,{withFileTypes:true})){if(['node_modules','.git','private','backups'].includes(e.name)||e.name.startsWith('.env'))throw Error('Diretório contém material privado/dependências: '+e.name+'; use uma entrada isolada');await walk(path.join(full,e.name),rel?rel+'/'+e.name:e.name);}
 }else if(stat.isFile()){safePath(rel);if(stat.size>POLICY.maxFileBytes)throw Error('Arquivo maior que 8 MiB');total+=stat.size;if(total>POLICY.maxTotalBytes||files.length>=POLICY.maxFiles)throw Error('Limite do projeto excedido');const handle=await fs.open(full,constants.O_RDONLY|(constants.O_NOFOLLOW||0));let bytes;try{const buffer=Buffer.alloc(POLICY.maxFileBytes+1);let count=0;while(count<buffer.length){const r=await handle.read(buffer,count,buffer.length-count,count);if(!r.bytesRead)break;count+=r.bytesRead;}if(count>POLICY.maxFileBytes)throw Error('Arquivo cresceu além do limite');bytes=new Uint8Array(buffer.subarray(0,count));}finally{await handle.close();}files.push({path:rel,bytes});}else throw Error('Tipo de arquivo não suportado');}
 await walk(abs,first.isDirectory()?'':path.basename(abs));return {files,absolute:realInput,isDir:first.isDirectory()};
}
async function diagnose(){const project=await readProject(arg('input'));const analysis=await analyze(project.files),plan=makePlan(analysis),planHash=await sha256(canonical(plan));return {project,analysis,plan,planHash};}
try{
 if(command==='doctor'){
  const tools={};for(const n of ['pnpm','caddy','docker']){const r=spawnSync(n,['--version'],{encoding:'utf8'});tools[n]={available:!r.error&&r.status===0,version:(r.stdout||r.stderr||'').trim().slice(0,120)};}
  const deps={};for(const n of ['vite','lit','typescript','ajv','vitest']){try{import.meta.resolve(n);deps[n]=true;}catch{deps[n]=false;}}
  console.log(JSON.stringify({node:process.version,expectedNodeMajor:26,nodeMatches:Number(process.versions.node.split('.')[0])===26,tools,dependencies:deps,installsPerformed:false},null,2));
 }else if(command==='inspect'){
  const d=await diagnose(),value={analysis:d.analysis,plan:d.plan,planHash:d.planHash};if(arg('out'))await freshJSON(arg('out'),value);else console.log(JSON.stringify(value,null,2));
 }else if(command==='approve-private'){
  const d=await diagnose();if(arg('accept-plan')!==d.planHash)throw Error('Use --accept-plan com o hash exato do plano revisado');if(!arg('out'))throw Error('--out obrigatório');await freshJSON(arg('out'),await createJob(d.analysis,d.planHash));console.log('Job privado criado; sem autorização de publicação.');
 }else if(command==='recover-private'){
  if(!arg('job')||!arg('out'))throw Error('--job e --out obrigatórios');const d=await diagnose(),jobPath=path.resolve(arg('job'));if((await fs.stat(jobPath)).size>POLICY.maxFileBytes)throw Error('Job excedido');const job=parseJSON(await fs.readFile(jobPath,'utf8'));await validateJob(job,d.analysis);
  if(arg('accept-plan')!==d.planHash)throw Error('Aprovação exata necessária em --accept-plan');
  const requested=path.resolve(arg('out'));const dest=path.join(await fs.realpath(path.dirname(requested)),path.basename(requested));if(dest===d.project.absolute||d.project.isDir&&dest.startsWith(d.project.absolute+path.sep))throw Error('Saída não pode estar dentro da entrada');
  try{await fs.lstat(dest);throw Error('Destino já existe; não sobrescrever');}catch(e){if(e.code!=='ENOENT')throw e;}
  const prepared=[];
  for(const op of d.plan.operations){if(op.blocked)throw Error('Entrada bloqueada: '+op.path);if(op.operation!=='recover_private_sources')throw Error('Mapeamento manual necessário: '+op.path);const input=d.project.files.find(f=>f.path===op.path);const snapshot=scanHTML(new TextDecoder('utf-8',{fatal:true}).decode(input.bytes)),recovery=recoverable(snapshot);await verifyRecovery(recovery);prepared.push({input,op,recovery});}
  if(!prepared.length)throw Error('Nenhuma fonte recuperável');
  const staging=await fs.mkdtemp(path.join(path.dirname(dest),'.atelie-stage-'));await fs.chmod(staging,0o700);try{
   const inventory=[];for(const {input,op,recovery}of prepared){const prefix=op.sha256.slice(0,16);await fs.mkdir(path.join(staging,prefix),{recursive:true,mode:0o700});await fs.writeFile(path.join(staging,prefix,'ORIGINAL.html'),input.bytes,{flag:'wx',mode:0o600});for(const f of recovery.files){const rel=prefix+'/recovered/'+safePath(f.path),target=path.join(staging,...rel.split('/'));await fs.mkdir(path.dirname(target),{recursive:true,mode:0o700});await fs.writeFile(target,f.text,{flag:'wx',mode:0o600});inventory.push({path:rel,sha256:await sha256(f.text),declaredHashChecked:!!f.expectedSha256});}}
   await freshJSON(path.join(staging,'RECOVERY_MANIFEST.json'),{schema:'atelie-recovery/1',private:true,publicationAuthorized:false,family3Approved:false,planHash:d.planHash,files:inventory,scope:'Fonte recuperada, não módulo convertido'});await fs.rename(staging,dest);console.log(JSON.stringify({status:'private_recovery_completed_not_f3',files:inventory.length}));
  }catch(e){await fs.rm(staging,{recursive:true,force:true});throw e;}
 }else if(command==='release-check'){
  console.error('BLOQUEADO: build oficial/lockfile, migração funcional, Caddy/Docker, Firefox/WebKit e revisão humana ainda pendentes.');process.exitCode=2;
 }else throw Error('Comandos: doctor | inspect --input caminho [--out arquivo] | approve-private --input caminho --accept-plan hash --out job.json | recover-private --input caminho --job job.json --accept-plan hash --out NOVO_DESTINO | release-check');
}catch(e){console.error('BLOQUEADO: '+e.message);process.exitCode=1;}
