// @ts-check
/**
 * @typedef {import('../contracts/contracts.ts').SourceEntry} SourceEntry
 * @typedef {import('../contracts/contracts.ts').PrivateJob} PrivateJobContract
 * @typedef {{path:string,bytes:Uint8Array}} InputRecord
 * @typedef {{severity:'block'|'review',code:string,message:string}} Issue
 * @typedef {SourceEntry & {kind:'asset'|'html',family:string|null,module:string|null,adapter:string,recoverableFiles:number,issues:Issue[],recoveryNote?:string}} AnalysisEntry
 * @typedef {{schema:'atelie-analysis/1',policyVersion:string,fingerprint:string,totalBytes:number,entries:AnalysisEntry[],status:'diagnostic_only',releaseApproved:false}} Analysis
 * @typedef {{path:string,text:string,expectedSha256?:string}} RecoveredFile
 * @typedef {{adapter:string,files:RecoveredFile[],note:string}} Recovery
 * @typedef {{attrs:Record<string,string|undefined>,text:string}} ScriptBlock
 * @typedef {{tag:string,key:string,value:string}} HTMLReference
 * @typedef {{scripts:ScriptBlock[],references:HTMLReference[],warnings:string[],blocks:Record<string,string|undefined>,base:boolean,handlers:number}} HTMLSnapshot
 * @typedef {{kind:'unresolved'|'remote'|'embedded'|'unsafe'|'internal'|'root-relative'|'relative',value:string}} ResolvedReference
 * @typedef {{path:string,sha256:string,adapter:string,operation:'recover_private_sources'|'manual_mapping',blocked:boolean}} PlanOperation
 * @typedef {{schema:'atelie-plan/1',policyVersion:string,fingerprint:string,operations:PlanOperation[],profiles:{id:string,status:'not_verified'|'conditional'}[],blockers:string[],status:'recovery_only_not_f3',publicationAuthorized:false}} RecoveryPlan
 * @typedef {Omit<PrivateJobContract,'plan'> & {plan:RecoveryPlan}} CoreJob
 */

/** @param {unknown} value @returns {value is Record<string,unknown>} */
function isRecord(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}

export const POLICY = Object.freeze({version:'1.0.0',maxFiles:256,maxFileBytes:8*1024*1024,maxTotalBytes:32*1024*1024,maxDepth:64,maxEmbeddedFiles:256});
/** @param {unknown} value @returns {string} */
export function safePath(value){
 if(typeof value!=='string'||!value||value.length>512||/[\u0000-\u001f\\]/.test(value)||value.startsWith('/')||/^[A-Za-z]:/.test(value))throw Error('Caminho inválido');
 const p=value.normalize('NFC').split('/');if(p.some(x=>!x||x==='.'||x==='..'||/[<>:"|?*]/.test(x)||/[. ]$/.test(x)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(x)))throw Error('Caminho inseguro');return p.join('/');
}
/** @param {unknown} value @returns {string} */
export function canonical(value){
 if(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)){const text=JSON.stringify(value);if(typeof text!=='string')throw Error('Valor não canônico');return text;}
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(isRecord(value))return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
 throw Error('Valor não canônico');
}
/** @param {string|Uint8Array} input @returns {Promise<string>} */
export async function sha256(input){
 if(!globalThis.crypto?.subtle)throw Error('SHA-256 indisponível neste contexto. Use localhost/HTTPS; análise não foi concluída.');
 const bytes=typeof input==='string'?new TextEncoder().encode(input):new Uint8Array(input);
 return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes.buffer))).map(x=>x.toString(16).padStart(2,'0')).join('');
}
/** @param {string} text @returns {unknown} */
export function parseJSON(text){
 /** @type {unknown} */ let value;try{value=JSON.parse(text);}catch{throw Error('JSON inválido; conteúdo-fonte omitido da mensagem');}
 /** @type {Array<[unknown,number]>} */ const stack=[[value,0]];
 while(stack.length){const frame=stack.pop();if(!frame)break;const[v,d]=frame;if(d>POLICY.maxDepth)throw Error('JSON profundo demais');if(v&&typeof v==='object')for(const[k,child]of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))throw Error('Chave reservada em JSON');stack.push([child,d+1]);}}
 return value;
}
/** @param {string} raw @returns {Record<string,string|undefined>} */
function attrs(raw){
 /** @type {Record<string,string|undefined>} */ const result=Object.create(null);let i=0;
 while(i<raw.length){while(i<raw.length&&/[\s/]/.test(raw[i]))i++;let s=i;while(i<raw.length&&!/[\s=/>]/.test(raw[i]))i++;if(i===s){i++;continue;}const key=raw.slice(s,i).toLowerCase();while(/\s/.test(raw[i]||'')&&i<raw.length)i++;let value='';
 if(raw[i]==='='){i++;while(/\s/.test(raw[i]||'')&&i<raw.length)i++;const q=raw[i];if(q==='"'||q==="'"){i++;s=i;while(i<raw.length&&raw[i]!==q)i++;value=raw.slice(s,i);i++;}else{s=i;while(i<raw.length&&!/[\s>]/.test(raw[i]))i++;value=raw.slice(s,i);}}
 if(Object.hasOwn(result,key))throw Error('Atributo duplicado; requer parser completo');result[key]=value;
 }return result;
}
/** @param {string} text @returns {HTMLSnapshot} */
export function scanHTML(text){
 /** @type {ScriptBlock[]} */ const scripts=[];
 /** @type {HTMLReference[]} */ const references=[];
 /** @type {string[]} */ const warnings=[];
 /** @type {string[]} */ const ids=[];
 const lower=text.toLowerCase();let i=0,base=false,handlers=0;
 while(i<text.length){let start=text.indexOf('<',i);if(start<0)break;
 if(text.startsWith('<!--',start)){let end=text.indexOf('-->',start+4);if(end<0)throw Error('Comentário HTML não fechado');i=end+3;continue;}
 let j=start+1;if(text[j]==='!'||text[j]==='?'||text[j]==='/'){i=text.indexOf('>',j);if(i<0)break;i++;continue;}
 const m=/^[A-Za-z][A-Za-z0-9:-]*/.exec(text.slice(j));if(!m){i=j;continue;}const tag=m[0].toLowerCase();j+=m[0].length;let end=j,q=null;
 for(;end<text.length;end++){const c=text[end];if(q){if(c===q)q=null;}else if(c==='"'||c==="'")q=c;else if(c==='>')break;}if(end===text.length)throw Error('Tag HTML não fechada');
 const a=attrs(text.slice(j,end));i=end+1;if(a.id)ids.push(a.id);if(tag==='base')base=true;handlers+=Object.keys(a).filter(k=>k.startsWith('on')).length;
 for(const key of ['src','poster'])if(a[key]!==undefined)references.push({tag,key,value:a[key]});if(tag==='link'&&a.href&&/(?:^|\s)(stylesheet|icon|manifest|preload|modulepreload)(?:\s|$)/.test(a.rel||''))references.push({tag,key:'href',value:a.href});
 if(['script','style','textarea','title'].includes(tag)){
  let close=lower.indexOf('</'+tag,i);while(close>=0&&!/[\s/>]/.test(lower[close+tag.length+2]||''))close=lower.indexOf('</'+tag,close+2);
  if(close<0)throw Error('Bloco '+tag+' não fechado');if(tag==='script')scripts.push({attrs:a,text:text.slice(i,close)});i=text.indexOf('>',close);if(i<0)throw Error('Fechamento inválido');i++;
 }
 }
 if(base)warnings.push('Elemento base exige revisão de resolução de URLs');if(handlers)warnings.push(handlers+' handlers inline: revisar CSP');if(new Set(ids).size!==ids.length)warnings.push('IDs duplicados no HTML estático');
 /** @type {Record<string,string|undefined>} */ const blocks=Object.create(null);for(const s of scripts)if(s.attrs.id){if(Object.hasOwn(blocks,s.attrs.id))throw Error('Bloco com ID duplicado');blocks[s.attrs.id]=s.text;}
 return {scripts,references,warnings,blocks,base,handlers};
}
/** @param {string} from @param {string} ref @returns {ResolvedReference} */
export function resolveReference(from,ref){
 if(/[&]/.test(ref))return {kind:'unresolved',value:ref};if(/^(?:https?:)?\/\//i.test(ref))return {kind:'remote',value:ref};
 if(/^[A-Za-z][\w+.-]*:/.test(ref))return {kind:ref.startsWith('data:')?'embedded':'unsafe',value:ref};if(!ref||ref.startsWith('#'))return {kind:'internal',value:ref};if(ref.startsWith('/'))return {kind:'root-relative',value:ref};
 const clean=ref.split(/[?#]/)[0];let decoded;try{decoded=decodeURIComponent(clean);}catch{throw Error('URL malformada');}if(decoded.includes('\\')||decoded.includes('\0'))throw Error('Referência insegura');
 const stack=from.split('/').slice(0,-1);for(const part of decoded.split('/')){if(!part||part==='.')continue;if(part==='..'){if(!stack.length)throw Error('Referência fora da raiz');stack.pop();}else stack.push(part);}return {kind:'relative',value:safePath(stack.join('/'))};
}
/** @param {Pick<HTMLSnapshot,'blocks'>} snapshot @returns {Recovery} */
export function recoverable(snapshot){
 const raw=snapshot.blocks['atelie-source-assets'];if(raw===undefined)return {adapter:'manual',files:[],note:'Sem fonte embutida reconhecida; requer adaptador de domínio.'};const value=parseJSON(raw);
 if(!isRecord(value))throw Error('Fonte embutida inválida');
 /** @type {RecoveredFile[]} */ const files=[];
 if(isRecord(value.source_files)){
  for(const [path,content]of Object.entries(value.source_files)){if(typeof content!=='string')throw Error('Fonte não textual não suportada');files.push({path:safePath(path),text:content});}
  if(!files.length)throw Error('Fonte embutida vazia');if(files.length>POLICY.maxEmbeddedFiles)throw Error('Muitas fontes embutidas');if(value.source_manifest!==undefined){const manifest=value.source_manifest;if(!isRecord(manifest)||Object.keys(manifest).length!==files.length)throw Error('Manifesto de fontes inconsistente');for(const f of files){const expected=manifest[f.path];if(!Object.hasOwn(manifest,f.path)||typeof expected!=='string'||!/^[a-f0-9]{64}$/.test(expected))throw Error('Hash de fonte ausente/inválido');f.expectedSha256=expected;}}return {adapter:'atelie-source-map/1',files,note:'Recuperação textual exata; não é conversão F3.'};
 }
 if(Object.hasOwn(value,'base_css')&&Object.hasOwn(value,'tokens')){if(Object.keys(value).length>POLICY.maxEmbeddedFiles-6)throw Error('Muitos componentes embutidos');
  for(const[key,content]of Object.entries(value)){safePath(key);files.push({path:'components/'+key+(typeof content==='string'?'.txt':'.json'),text:typeof content==='string'?content:canonical(content)});}
  for(const id of ['atelie-engine','atelie-build-template','atelie-config','atelie-registry','atelie-schema','atelie-references']){const text=snapshot.blocks[id];if(text!==undefined)files.push({path:'blocks/'+id+'.txt',text});}
  return {adapter:'atelie-components/1',files,note:'Blocos e componentes preservados; nomes originais de arquivos não foram inventados.'};
 }
 return {adapter:'manual',files:[],note:'Formato embutido desconhecido; não adivinhar mapeamento.'};
}
/** @param {InputRecord[]} records @returns {Promise<Analysis>} */
export async function analyze(records){
 if(!Array.isArray(records)||!records.length)throw Error('Selecione ao menos um arquivo');if(records.length>POLICY.maxFiles)throw Error('Quantidade excedida');
 /** @type {Set<string>} */ const seen=new Set();
 /** @type {InputRecord[]} */ const checked=[];let total=0;
 for(const item of records){const path=safePath(item.path);const lower=path.toLowerCase();if(seen.has(lower))throw Error('Colisão de caminhos/maiúsculas: '+path);seen.add(lower);const bytes=item.bytes;if(!(bytes instanceof Uint8Array))throw Error('Bytes de entrada inválidos');if(bytes.length>POLICY.maxFileBytes)throw Error('Arquivo maior que 8 MiB');total+=bytes.length;if(total>POLICY.maxTotalBytes)throw Error('Projeto maior que 32 MiB');if(/\.zip$/i.test(path))throw Error('ZIP ainda não suportado: intake bloqueado, não foi extraído');checked.push({path,bytes});}
 checked.sort((a,b)=>(a.path<b.path?-1:a.path>b.path?1:0));
 /** @type {AnalysisEntry[]} */ const entries=[];const available=new Set(checked.map(x=>x.path));
 for(const item of checked){const hash=await sha256(item.bytes);
 /** @type {AnalysisEntry} */ const entry={path:item.path,bytes:item.bytes.length,sha256:hash,kind:'asset',family:null,module:null,adapter:'manual',recoverableFiles:0,issues:[]};
 if(/\.html?$/i.test(item.path)){
  entry.kind='html';try{const text=new TextDecoder('utf-8',{fatal:true}).decode(item.bytes),s=scanHTML(text);for(const message of s.warnings)entry.issues.push({severity:'review',code:'HTML_REVIEW',message});
   /** @type {unknown} */ let config=null;
   if(s.blocks['atelie-config'])config=parseJSON(s.blocks['atelie-config']);if(isRecord(config)){entry.family=typeof config.family_version==='string'?config.family_version:null;entry.module=String(config.slug||config.id||'');}else if(Array.isArray(config)){entry.module='';}
   if((isRecord(config)&&config.module_id==='ost-pesquisa')||entry.module==='ost-pesquisa'||/kit_modulo_03_ost_pesquisa/i.test(item.path)){entry.issues.push({severity:'block',code:'OST_PAUSED',message:'OST pausada; recuperação não autorizada nesta rodada.'});entry.adapter='paused';}
   else{const r=recoverable(s);await verifyRecovery(r);entry.adapter=r.adapter;entry.recoverableFiles=r.files.length;entry.recoveryNote=r.note;}
   for(const ref of s.references){const r=resolveReference(item.path,ref.value);if(r.kind==='relative'&&!available.has(r.value))entry.issues.push({severity:'block',code:'MISSING_ASSET',message:r.value});else if(['remote','root-relative','unsafe','unresolved'].includes(r.kind))entry.issues.push({severity:r.kind==='unsafe'?'block':'review',code:'URL_REVIEW',message:r.kind==='remote'?'Referência remota: detalhes omitidos do diagnóstico':r.kind==='unsafe'?'Esquema de URL inseguro':r.kind==='unresolved'?'Referência com codificação/entidades a revisar':'Caminho a partir da raiz: '+r.value.split(/[?#]/)[0]});}
   entry.issues.push({severity:'review',code:'DYNAMIC_UNRESOLVED',message:'Referências dinâmicas JS/CSS e equivalência de domínio ainda não verificadas.'});
  }catch(error){entry.adapter='manual';entry.issues.push({severity:'block',code:'PARSE_REVIEW',message:error instanceof Error?error.message:'Falha de análise; detalhes omitidos'});}
 }
 entries.push(entry);
 }
 const fingerprint=await sha256(canonical(entries.map(({path,sha256,bytes})=>({path,sha256,bytes}))));return {schema:'atelie-analysis/1',policyVersion:POLICY.version,fingerprint,totalBytes:total,entries,status:'diagnostic_only',releaseApproved:false};
}
/** @param {AnalysisEntry} e @returns {PlanOperation} */
function operationFor(e){return {path:e.path,sha256:e.sha256,adapter:e.adapter,operation:e.recoverableFiles?'recover_private_sources':'manual_mapping',blocked:e.adapter==='paused'||e.issues.some(x=>x.severity==='block')};}

/** @param {Analysis} analysis @returns {RecoveryPlan} */
export function makePlan(analysis){
 return {schema:'atelie-plan/1',policyVersion:POLICY.version,fingerprint:analysis.fingerprint,operations:analysis.entries.filter(e=>e.kind==='html').map(operationFor),profiles:[{id:'web_https',status:'not_verified'},{id:'local_served',status:'not_verified'},{id:'own_server',status:'not_verified'},{id:'portable',status:'conditional'}],blockers:['OFFICIAL_BUILD_NOT_EXECUTED','DOMAIN_EQUIVALENCE_NOT_EXECUTED','REAL_MIGRATION_ADAPTERS_PENDING'],status:'recovery_only_not_f3',publicationAuthorized:false};
}
/** @param {Analysis} analysis @param {string} approvedHash @returns {Promise<CoreJob>} */
export async function createJob(analysis,approvedHash){const plan=makePlan(analysis),planHash=await sha256(canonical(plan));if(!plan.operations.length||plan.operations.some(o=>o.blocked||o.operation!=='recover_private_sources'))throw Error('Plano exige adaptação manual; recuperação automática bloqueada');if(approvedHash!==planHash)throw Error('Aprovação ausente ou plano alterado');return {schema:'atelie-private-job/1',plan,inventory:analysis.entries.map(({path,bytes,sha256})=>({path,bytes,sha256})),approval:{planHash,kind:'local_acknowledgement_not_signature',scope:'private_source_recovery_only'},containsSourceContents:false,publicationAuthorized:false};}
/** @param {unknown} job @param {Analysis} analysis @returns {Promise<true>} */
export async function validateJob(job,analysis){
 if(!isRecord(job)||job.schema!=='atelie-private-job/1'||job.publicationAuthorized!==false||job.containsSourceContents!==false||!isRecord(job.approval)||job.approval.scope!=='private_source_recovery_only')throw Error('Contrato de job inválido');
 const expected=await createJob(analysis,await sha256(canonical(makePlan(analysis))));if(canonical(job)!==canonical(expected))throw Error('Job alterado, origem diferente ou aprovação obsoleta');return true;
}

/** @param {{files:RecoveredFile[]}} recovery @returns {Promise<true>} */
export async function verifyRecovery(recovery){/** @type {Set<string>} */ const seen=new Set();for(const file of recovery.files){const path=safePath(file.path),fold=path.toLowerCase();if(seen.has(fold))throw Error('Colisão nas fontes recuperadas');seen.add(fold);const actual=await sha256(file.text);if(file.expectedSha256&&file.expectedSha256!==actual)throw Error('Hash da fonte embutida não confere: '+path);}return true;}
