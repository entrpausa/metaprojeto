# R2 — fundação oficial em repositório público

## Planejamento e estado real

Fonte: PLANO_CHECKLISTS_F3_POR_RODADA_v1.0.md, versão 1.0.0, 72557 bytes.
SHA-256: dab2e94a4b38edd338e87380b7385965d575f7e54e2f581cd4c6c3d15aaaaaf9.
Conferidos 65 IDs únicos (R2/R3/R4/R5:12 cada; R6:9; R7:8), sem ciclos/dependências ausentes e todos com aceite/caso/evidência previstos. Conferência documental não aprova software. O Markdown integral está no anexo do projeto; sua incorporação integral ao GitHub permanece pendente.

A auditoria 44970878072 passou em Node 26. A sonda 44973530328, commit b388149362f7fd4b35bbecc5bb8e4fe30af454bc, foi ignorada pelo requisito de privacidade; não instalou nem compilou. A suposição anterior de repositório privado foi corrigida. O usuário autorizou manter entrpausa/metaprojeto público.

## Custos e visibilidade

ubuntu-24.04 é runner GitHub-hosted padrão: computação gratuita em repositórios públicos. Privados usam a franquia do plano, com eventual cobrança/bloqueio após consumi-la; mudar visibilidade não contrata automaticamente um plano pago. Larger runners podem ser cobrados mesmo em públicos. Armazenamento tem regras próprias; não foi consultado saldo/fatura e não se promete custo total zero.

Fontes: https://docs.github.com/en/billing/concepts/product-billing/github-actions e https://docs.github.com/en/actions/reference/runners/github-hosted-runners .

Logs/resumos são públicos. Artefatos também não são privados: usuários autenticados com leitura podem baixá-los. Fonte: https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/downloading-workflow-artifacts .

## Política da sonda ajustada

- Executar somente neste repositório enquanto público; em privado, ignorar esta sonda para evitar consumo privado inesperado. Outros workflows têm regras próprias.
- contents:read, credenciais não persistidas, ações fixadas por SHA, cache desativado e dez minutos por execução.
- Sem passar HTMLs originais dos pilotos, entrevistas, backups, credenciais ou recuperações privadas aos comandos. Ferramentas de desenvolvimento executam código; isso não é uma certificação de segurança.
- Artefato público por sete dias: somente result.json, installed.json, pnpm-lock.yaml e package.sha256, quando gerados. Arquivos regulares, sem symlinks, até 1 MiB no total antes da compactação. Sem logs brutos, dist, node_modules ou cópia da árvore do runner. Allowlist/tamanho não substituem revisão de conteúdo.
- Resolver lockfile sem lifecycle/pnpmfile, instalar frozen-lockfile e recusar mudanças de manifest/workspace/lock. O lockfile é realmente gerado, não fabricado ou commitado automaticamente.
- Tentar tipagem, Ajv, Vitest e Vite; registrar versões/licenças/engines instalados. continue-on-error apenas coleta diagnósticos; etapa obrigatória não aprovada impede sucesso. Falha na validação pública impede upload.
- Sem push automático, merge, deploy ou mudança dos gates. publicationAuthorized:false refere-se aos módulos/dados, não aos diagnósticos técnicos públicos autorizados.

## Stack, lacunas e continuidade

Mantidos Node >=26 <27, pnpm 12.9.1, Vite 8.3.5, Lit 3.3.3, TypeScript 7.0.2, Vitest 5.1.0, Ajv 8.20.0 e @types/node 24.19.2. Publicação de uma versão não prova instalação/compatibilidade. Patch do Node, licenças e transitivas seguem em revisão.

R2-02/R2-03 em execução; R2-04 aberto: allowJs:true/checkJs:false e o include de TS não verificam o núcleo JS. Exigem-se cobertura efetiva e caso negativo crítico. R2-05/R2-06 aguardam execução/revisão. Verde nesta sonda não fecha R2 nem homologa F3.

Nesta preparação, o blob original foi conferido, YAML/onze trechos de shell foram analisados e quatro fixtures do limite público passaram: válido, excesso, symlink e relatório ausente. Não foram recontados os 63 testes anteriores nem executados instalação/build novos.

Após confirmação do commit ajustado, consultar a nova execução real antes de corrigir incompatibilidades. Fontes/visual preservados, OST pausada e release F3 bloqueado.
