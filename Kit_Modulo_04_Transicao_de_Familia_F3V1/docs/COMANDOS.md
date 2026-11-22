# Comandos e escopos

## Diagnóstico sem execução do legado

```sh
node tools/atelier.mjs doctor
node tools/atelier.mjs inspect --input /caminho/para/legado.html
```

`inspect` concluir com exit0 significa que o diagnóstico rodou, não que o legado foi aprovado. Veja os achados e o plano.

## Aprovação de recuperação privada

Revise o plano e copie o `planHash` exato. Mantenha o job fora da pasta de entrada.

```sh
node tools/atelier.mjs approve-private --input /caminho/para/legado.html --accept-plan HASH_EXATO --out /pasta/privada/job.json
node tools/atelier.mjs recover-private --input /caminho/para/legado.html --job /pasta/privada/job.json --accept-plan HASH_EXATO --out /pasta/privada/DESTINO_NOVO
```

O destino deve ser novo e fora da entrada. A ferramenta salva um ORIGINAL.html e as fontes recuperadas em diretório privado com manifesto `family3Approved:false`. Permissões0600/0700 são aplicadas quando suportadas pelo sistema. Não executar os scripts extraídos automaticamente.

A aprovação local é um reconhecimento de conteúdo/hash, não identidade autenticada ou assinatura digital. Não é autorização de publicação. Entradas diferentes, plano alterado e destino existente são recusados.

Pastas com symlinks, .git, node_modules, .env*, private ou backups são recusadas nesta implementação; prepare uma entrada isolada. Limites:256 arquivos, 8MiBpor arquivo, 32MiBtotal, 1024 itens de árvore visitados, profundidade de caminho24eJSON64. Esses são limites iniciais testados parcialmente, não ensaio de capacidade universal.

## Retomada da stack oficial

Em ambiente autorizado com Node 26 LTS e gerenciador fixado:

```sh
pnpm install --lockfile-only
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run compile:schemas
pnpm run test:official
pnpm run build
```

A primeira execução gera lockfile e faz downloads:precisa de rede/autorização. Essas operações NÃO foram realizadas nesta entrega. Fixar dependências diretas não congela as transitivas. Revise licenças, integridade, gerenciador e compatibilidade antes de aceitar a resolução.

Core contém ESM compartilhado e contratos/entrada TypeScript. `checkJs:false` está explícito:tipagem integral do núcleo ainda é pendência. O compiladorTS não foi executado; nenhum check tipado é presumido aprovado.

## Reprodução das verificações auxiliares

```sh
node --test tests/core.test.mjs
node tools/build-preview.mjs
python tests/test_browser.py --output resultado-browser.json
```

O último comando exige Python e Playwright/Chromium disponíveis. Python é ferramenta opcional de QA, não dependência do visitante da aplicação. Não usar Node 20 do ambiente de QA como versão de release oficial:foi usado somente nos testes nativos e no servidor de prévia.
