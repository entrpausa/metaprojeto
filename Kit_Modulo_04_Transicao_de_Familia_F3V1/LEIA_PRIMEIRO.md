# Ateliê — Transição F3 / pacote candidato

STATUS: implementação inicial R2–R3. NÃO É UM KIT F3 HOMOLOGADO.

O plano e a base visual foram aprovados pelo usuário. A implementação já permite diagnóstico local, prévia/plano, aprovação restrita, job sem fontes e recuperação privada de duas estruturas legadas. Não transforma ainda os módulos em F3.

## Experimentar a interface

Abra `preview/index.html` em Chromium para a prévia auxiliar. Ela é autocontida e foi testada também por file URL. Compatibilidade file URL em outros navegadores não foi verificada.

Para usar via localhost, tendo Node instalado:

```sh
node tools/serve-preview.mjs
```

Abra o endereço impresso. O servidor atende somente a prévia em loopback, não o diretório inteiro. Não é servidor de produção.

Comece por “Carregar exemplo fictício” e “Analisar”. Para dados reais, selecionar arquivos apenas lê bytes localmente; não executa o legado, não envia o conteúdo e não usa armazenamento persistente. Reload perde a sessão:baixe o diagnóstico/job quando necessário.

## O que funciona

- Intake de arquivos e pasta com limites explícitos; ZIP é recusado sem extração.
- SHA-256, metadata declarada, referências HTML estáticas e indicação de incerteza.
- Dois reconhecedores:componentes/blocos e mapa de arquivos-fonte embutidos.
- Verificação de hashes declarados do mapa de fontes.
- Plano e job vinculados ao inventário; alterações invalidam aprovação.
- Diagnóstico privado baixável, inclusive para entradas bloqueadas; job de recuperação somente quando há adaptador e não há bloqueios estruturais.
- Recuperação privada via CLI, sem sobrescrever destino existente e sem executar scripts recuperados.

## O que NÃO funciona ainda como release final

Build oficial Vite/Lit/TypeScript/Ajv, lockfile transitivo, conversão dos métodos, ZIP seguro, designsystem completo, portal/suite de legados, ServiceWorker/PWA, Caddy/Docker, Firefox/WebKit, WCAG completa e publicação real.

A prévia usa exatamente o núcleo e o componente nativo compartilhados com a entrada Lit proposta, mas NÃO foi gerada por `vite build` e NÃO comprova integração Lit. Não é uma stack substituta silenciosa.

Leia HANDOFF.md, GATEKEEPING.md ePLANO_DAS_RODADAS.md. `node tools/atelier.mjs release-check` retorna falha de propósito nesta etapa.
