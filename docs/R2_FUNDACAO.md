# R2 — fundação oficial: planejamento recebido e sonda preparada

## Fonte do planejamento

Arquivo recebido: PLANO_CHECKLISTS_F3_POR_RODADA_v1.0.md, versão 1.0.0.
SHA-256: dab2e94a4b38edd338e87380b7385965d575f7e54e2f581cd4c6c3d15aaaaaf9.
Tamanho original: 72557 bytes, UTF-8.

O conteúdo completo foi lido no ambiente local e os 65 IDs foram conferidos: R2=12, R3=12, R4=12, R5=12, R6=9, R7=8. Não há IDs duplicados, dependências ausentes ou ciclos. Todos têm aceite, caso planejado e evidência prevista.

Esta conferência é documental, não teste do produto. A fonte integral permanece no anexo do projeto; esta referência não é uma cópia integral do Markdown no GitHub. A incorporação integral permanece pendente, sem impedir a execução de R2. O plano R0–R7 e a base visual continuam aprovados; nenhum checkbox foi aceito automaticamente.

## Base já executada

Commit f629e53c35093789c677d7e4db1566a563dc8f12: auditoria inicial concluída com sucesso no Actions, execução 44970878072. Verificou o original e executou os grupos nativos do núcleo/auditor em Node 26. Não realizou instalação das dependências nem build oficial.

## R2-02 — matriz declarativa

| Ferramenta | Versão declarada | Conferência nesta rodada |
|---|---|---|
| Node | >=26 <27 | Família já executada no CI; patch exato ainda precisa ser registrado/fixado. |
| pnpm | 12.9.1 | Versão e metadata localizadas no registro; instalação pendente. |
| Vite | 8.3.5 | Metadata admite Node 26; execução pendente. |
| TypeScript | 7.0.2 | Metadata consultada retornou essa versão; compilação pendente. |
| Vitest | 5.1.0 | Engines admitem Node 26 e não Node 20; execução pendente. |
| Ajv | 8.20.0 | Versão localizada no registro; compilação dos schemas pendente. |
| Lit | 3.3.3 | Publicação localizada no npm; integração real pendente. |
| @types/node | 24.19.2 | Mantida a versão declarada; checagem direta/instalada pendente. Não foi substituída silenciosamente por tipos 26. |

Versão publicada, licença declarada, instalação e compatibilidade executada são provas diferentes. A sonda registrará versões/licenças/engines instalados; isso não encerra revisão de licenças transitivas nem auditoria de segurança.

## Lacuna confirmada de R2-04

O tsconfig usa allowJs:true e checkJs:false. Seu include enumera TS em apps, contracts e tests/official; isso não verifica os tipos do núcleo JavaScript. Passar no comando atual não fecha R2-04. Exigem-se cobertura efetiva e caso negativo que detecte erro em operação crítica.

## Sonda proposta

Sem alterar fontes do candidato ou versões declaradas:

1. Auditar uma cópia fixada da importação original, separada da árvore atual.
2. Preparar Node 26 e pnpm 12.9.1 por ações fixadas por SHA.
3. Resolver lockfile sem lifecycle e sem hooks pnpmfile; bloquear mudanças em package.json/workspace.
4. Instalar com frozen-lockfile, conferir que lockfile/manifest não mudaram e registrar metadata instalada.
5. Executar os comandos declarados de tipagem, Ajv, Vitest e Vite. São primeiras execuções diagnósticas, não aceite automático de R2-04/05/06.
6. Preservar resultados, logs e lockfile, se gerado, em artefato privado por sete dias. Não salvar node_modules, fontes legadas, dist, entrevistas ou backups nesse artefato.
7. Retornar falha se alguma etapa obrigatória falhar, for ignorada ou não executar. continue-on-error serve apenas para coletar os demais diagnósticos.

Sem deploy, merge, push automático ou alteração dos gates. A sonda só executa se o repositório for privado; em repositório público o job fica ignorado, não aprovado. contents:read, credenciais não persistidas, cache desativado e limite de dez minutos para esta sonda. Downloads, minutos e armazenamento de artefatos podem consumir franquia ou gerar cobrança conforme a configuração da conta. A instalação do gerenciador executa sua ação oficial; os comandos de build/teste executam ferramentas confiáveis declaradas, não programas recebidos de legados.

O lockfile será realmente gerado no runner e revisado antes de eventual commit; não foi fabricado nem incorporado nesta rodada. O Node ainda é selecionado pela família 26, portanto esta sonda não comprova reprodução final por patch fixo.

## Verificações locais desta preparação

YAML e dez trechos de shell conferidos. Fixtures verificaram agregação com sucesso, falha, etapa ignorada, metadata coerente/divergente e rejeição do Node 20. Não houve nova execução de testes do produto, instalação real ou build oficial nesta preparação.

## Estado e continuidade

R2-02 e R2-03: em execução. R2-04: lacuna identificada. R2-05 e R2-06: execuções pendentes. Nenhum desses itens foi declarado aceito.

Após confirmação específica: gravar a configuração, consultar sua execução real, revisar diagnósticos e então corrigir incompatibilidades. Corrigir tipagem e integração por evidências; não ocultar testes nem flexibilizar gates para obter verde. OST pausada; candidato ainda aberto.
