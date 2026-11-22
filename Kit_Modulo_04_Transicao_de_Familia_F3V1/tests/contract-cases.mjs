import {webcrypto}from'node:crypto';import {POLICY,safePath,canonical,parseJSON,sha256,scanHTML,recoverable,verifyRecovery,resolveReference,analyze,makePlan,createJob,validateJob}from'../packages/core/core.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const enc=new TextEncoder();export const record=(path,text)=>({path,bytes:enc.encode(text)});
export function example(map={'README.md':'exemplo\n'},extra=''){const config=JSON.stringify({slug:'example',family_version:'2.0.0'});const data=JSON.stringify({source_files:map}).replace(/</g,'\\u003c');return '<!doctype html><script id="atelie-config" type="application/json">'+config+'<'+'/script><script id="atelie-source-assets" type="application/json">'+data+'<'+'/script>'+extra;}
export function registerTests(test,a){
 test('SHA-256 padrão',async()=>a.equal(await sha256('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
 for(const value of ['../x','/tmp/x','C:/x','a\\x','a/../b','a//b','a/./b','nul.txt','a\0b','a.'])test('Caminho bloqueado '+JSON.stringify(value),()=>a.throws(()=>safePath(value)));
 test('Caminho unicode preservado',()=>a.equal(safePath('ação/áudio.json'),'ação/áudio.json'));
 test('Objeto canônico tem ordem determinística',()=>a.equal(canonical({z:1,a:[2,null]}),'{"a":[2,null],"z":1}'));
 test('JSON profundo bloqueado',()=>a.throws(()=>parseJSON('['.repeat(70)+'0'+']'.repeat(70))));
 test('JSON prototype bloqueado',()=>a.throws(()=>parseJSON('{"__proto__":{}}')));
 test('Script não vira DOM executado',()=>{const x=scanHTML('<script>globalThis.HACKED=1;<'+'/script><script type="application/json" id="x">{"a":2}<'+'/script>');a.equal(x.scripts.length,2);a.equal(globalThis.HACKED,undefined);});
 test('Atributo com sinal maior',()=>a.equal(scanHTML('<script title="a>b" src="ok.js"><'+'/script>').references[0].value,'ok.js'));
 test('Comentários são ignorados',()=>a.equal(scanHTML('<!-- <script src="bad.js"> --><p>x</p>').references.length,0));
 test('Atributo duplicado bloqueia',()=>a.throws(()=>scanHTML('<script src="a" src="b"><'+'/script>')));
 test('Fonte recuperável exata',()=>a.equal(recoverable(scanHTML(example())).files[0].text,'exemplo\n'));
 test('Path traversal embutido bloqueado',()=>a.throws(()=>recoverable(scanHTML(example({'../bad':'x'})))));
 test('URL fora da raiz bloqueada',()=>a.throws(()=>resolveReference('index.html','../x.js')));
 test('URL normalizada',()=>a.equal(resolveReference('a/index.html','../b.js?q=1').value,'b.js'));
 test('Referência remota explícita',()=>a.equal(resolveReference('a.html','https://example.invalid/a.js').kind,'remote'));
 test('Colisão case-insensitive de entradas bloqueia',async()=>a.rejects(()=>analyze([record('A.html',''),record('a.html','')])));
 test('Arquivo ZIP bloqueado',async()=>a.rejects(()=>analyze([record('x.zip','anything')])));
 test('Entrada vazia bloqueia',async()=>a.rejects(()=>analyze([])));
 test('Quantidade excedida bloqueia',async()=>a.rejects(()=>analyze(Array.from({length:257},(_,i)=>record(i+'.txt','')))));
 test('Arquivo excedido bloqueia',async()=>a.rejects(()=>analyze([{path:'x',bytes:new Uint8Array(POLICY.maxFileBytes+1)}])));
 test('Asset ausente detectado',async()=>{const d=await analyze([record('a.html',example(undefined,'<script src="missing.js"><'+'/script>'))]);a.ok(d.entries[0].issues.some(x=>x.code==='MISSING_ASSET'));});
 test('Asset fornecido resolve',async()=>{const d=await analyze([record('a.html',example(undefined,'<script src="ok.js"><'+'/script>')),record('ok.js','')]);a.ok(!d.entries[0].issues.some(x=>x.code==='MISSING_ASSET'));});
 test('Sem família inferida do nome v1',async()=>a.equal((await analyze([record('legacy-v1.html','<p>x</p>')])).entries[0].family,null));
 test('Plano não homologa F3',async()=>{const p=makePlan(await analyze([record('a.html',example())]));a.equal(p.status,'recovery_only_not_f3');a.equal(p.publicationAuthorized,false);});
 test('Job exige aprovação exata',async()=>{const d=await analyze([record('a.html',example())]);await a.rejects(()=>createJob(d,'bad'));});
 test('Job tem hash e não transporta fonte',async()=>{const d=await analyze([record('a.html',example())]),j=await createJob(d,await sha256(canonical(makePlan(d))));a.equal(j.containsSourceContents,false);a.equal(await validateJob(j,d),true);a.ok(!JSON.stringify(j).includes('exemplo\\n'));});
 test('Job alterado é recusado',async()=>{const d=await analyze([record('a.html',example())]),j=await createJob(d,await sha256(canonical(makePlan(d))));j.plan.status='F3_APPROVED';await a.rejects(()=>validateJob(j,d));});
 test('Nova origem invalida job',async()=>{const d=await analyze([record('a.html',example())]),j=await createJob(d,await sha256(canonical(makePlan(d))));const changed=await analyze([record('a.html',example({'README.md':'alterado'}))]);await a.rejects(()=>validateJob(j,changed));});
 test('Manifesto de fontes adulterado bloqueia',async()=>a.rejects(()=>verifyRecovery({files:[{path:'a',text:'x',expectedSha256:'0'.repeat(64)}]})));
 test('Colisão de fontes embutidas bloqueia',async()=>a.rejects(()=>verifyRecovery({files:[{path:'A',text:'x'},{path:'a',text:'y'}]})));
 test('OST continua pausada',async()=>{const d=await analyze([record('Kit_Modulo_03_OST_Pesquisa_F_2_V_1.html',example())]);a.equal(d.entries[0].adapter,'paused');a.ok(makePlan(d).operations[0].blocked);});
 test('Bytes de entrada não são alterados',async()=>{const r=record('a.html',example()),old=Buffer.from(r.bytes);await analyze([r]);a.equal(Buffer.compare(old,r.bytes),0);});
 test('Erro JSON não revela conteúdo',()=>{try{parseJSON('SENTINELA_PRIVADA_INVALIDA');a.fail('não falhou');}catch(e){a.ok(!e.message.includes('SENTINELA_PRIVADA'));}});
 test('Impressão digital independe da ordem de entrada',async()=>{const one=record('a.html',example()),two=record('b.txt','x');a.equal((await analyze([one,two])).fingerprint,(await analyze([two,one])).fingerprint);});

 test('Job bloqueia adaptador manual',async()=>{const d=await analyze([record('a.html','<p>Sem fonte</p>')]);const hash=await sha256(canonical(makePlan(d)));await a.rejects(()=>createJob(d,hash));});

 test('Total agregado excedido bloqueia',async()=>{const bytes=new Uint8Array(POLICY.maxFileBytes);await a.rejects(()=>analyze(Array.from({length:5},(_,i)=>({path:i+'.bin',bytes}))));});
 test('Componentes legados excedidos bloqueiam',()=>{const data={base_css:'',tokens:{}};for(let i=0;i<260;i++)data['item'+i]='x';const snapshot={blocks:{'atelie-source-assets':JSON.stringify(data)}};a.throws(()=>recoverable(snapshot));});

 test('Pausa OST respeita module_id mesmo renomeado',async()=>{const html='<script id="atelie-config" type="application/json">{"module_id":"ost-pesquisa"}<'+'/script>';const d=await analyze([record('renomeado.html',html)]);a.equal(d.entries[0].adapter,'paused');});

}
