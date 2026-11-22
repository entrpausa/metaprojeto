# Retomada F3 — auditoria inicial

Início: 21/11/2026. Estado: candidato, sem homologação F3. Esta retomada trata das pendências de R2–R3; não renumera as rodadas R0–R7.

## Base conferida diretamente

Repositório: entrpausa/metaprojeto. Branch: f3/kit-04-consolidacao.
Commit importado: 7c3c9a57beab847bf7a08565d2b7a185ee4c90f4.
PR nº 1: aberto e sem merge na consulta. Main: 185903fac03ab651ba0649d7ea390229a1d9057e.

O commit lista 58 arquivos distintos. O manifesto exclui a si próprio: são 57 payloads e o próprio manifesto. Contagem não comprova integridade criptográfica.

## Verificações atuais

Ambiente medido: Linux, Python 3.12.14, Node v20.20.2. pnpm, Caddy e Docker não encontrados. Nenhuma dependência instalada.

Três arquivos obtidos pelo conector tiveram seus bytes conferidos com o SHA-256 do manifesto e com o identificador de blob do GitHub antes da execução:

| Arquivo | SHA-256 |
|---|---|
| packages/core/core.mjs | 5a68aed1432f2c39cf240d55c13bfdd9f264203587787f07827416fe4cdaaeae |
| tests/contract-cases.mjs | 5bfd8b3c44e3d677deb7fa6a156e9d3109f30e8c4e70f1c9e938598016e918bb |
| tests/core.test.mjs | 6fdc34be63ed7e68fed52732ec545e5ff46ba07142ef59d01399c66b0ec057d7 |

- 47 testes nativos do núcleo: passaram.
- 16 testes novos do auditor: passaram; cobrem texto/binário, alteração, tamanho, ausência, extras, manifesto, caminhos, colisões, symlinks, JSON e referência Git.
- Execução conjunta final: 63 testes, zero falhas, cancelamentos ou ignorados. Reexecuções não foram somadas.
- YAML analisado; sete trechos de shell passaram em bash -n; a escrita do resumo de quatro linhas foi testada localmente.

São checks auxiliares em Node 20, não build oficial em Node 26. Os 16 testes novos verificam o auditor, não métodos migrados, e não equivalem aos 65 itens do planejamento. Os 95 checks históricos não foram recontados como resultados atuais. Núcleo, interface e pasta original do candidato não foram alterados.

## Lacunas

- O kit exige Node >=26 <27; esta sessão tem Node 20. Sem fallback silencioso do ambiente oficial.
- Faltam lockfile, validação das versões no registro, compatibilidade real, tipagem, Ajv, Vitest e build Vite/Lit oficiais.
- A recuperação privada requer os dois HTMLs originais via --inputs. Eles não estão nos 58 arquivos importados; esses testes não foram executados nesta retomada.
- PLANO_CHECKLISTS_F3_POR_RODADA_v1.0.md não está na importação. O plano R0–R7 foi preservado; os 65 itens não foram reconstruídos por suposição.
- Os SHA-256 de todos os 57 payloads ainda não foram revalidados aqui; apenas os três arquivos discriminados acima tiveram os bytes conferidos nesta sessão.

## Automação proposta

Cinco arquivos: auditor independente, seus testes, workflow, README atualizado e este relatório. A pasta original permanece intacta.

O workflow seleciona Node 26 e registra a versão real. Audita uma segunda cópia do commit original fixado; depois diagnostica o ambiente e testa o núcleo da branch atual. Exige release-check igual a 2 e flags de homologação/publicação falsos.

Proteções: contents: read, credenciais não persistidas, ações oficiais fixadas por SHA completo, disparo somente na branch de trabalho, sem referência a secrets, instalação npm/pnpm, deploy, push automático ou merge. Limite: seis minutos por execução; pode consumir franquia ou gerar cobrança conforme o plano/configuração do GitHub Actions.

O patch do Node ainda não está fixado para reprodução final. Não há certificação de segurança; a revisão de dependências transitivas permanece pendente.

Na elaboração deste relatório, a gravação dos cinco arquivos aguardava confirmação e nenhuma execução remota do workflow havia ocorrido. Uma configuração válida não comprova uma execução. Resultados futuros devem identificar o commit e a execução correspondente.

## Continuidade

1. Autorizar e gravar os cinco arquivos em um único commit na branch de trabalho.
2. Consultar o resultado real do Actions e corrigir falhas sem ocultar testes ou flexibilizar gates.
3. Preparar dependências, lockfile e verificações oficiais.
4. Retomar transformação dos pilotos e distribuição independente/suite/local/web/servidor.
5. Atualizar os documentos atuais e consolidar evidências antes de propor homologação.

Sem autorização de publicação ou merge. OST pausada. Previsão provisória: 6–8 rodadas de execução, a revisar após a auditoria completa e o primeiro build oficial.
