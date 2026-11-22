# HANDOFF_E_INSIGHTS — Kit 04 / Transição F3

## Estado inequívoco

Pacote candidato de implementação, alvoF3V1. Kit ainda ABERTO; release F3 BLOQUEADO. A entrega técnica desta rodada fica documentada, não falsamente encerrada como migração concluída.

Plano aprovado às 12:00e base visual às 12:03em 21/11/2026. OST pausada. Nenhum modelo instalado/executado, entrevista transmitida ou publicação realizada.

## O que foi entregue

Interface funcional baseada na composição aprovada, núcleo ESM compartilhado, entrada proposta em TypeScript/Lit eVite, contratosJSON, CLI, prévia autocontida, templates de deploy bloqueados, testes e evidências. Não houve substituição silenciosa da stack:prévia auxiliar não é build oficial.

Fluxos operacionais:selecionar arquivos/pasta, analisar bytes, inspecionar metadata e referências HTML estáticas, baixar diagnóstico privado, revisar e reconhecer plano, baixar job sem fontes e recuperar fontes privadamente via CLI. ZIPnão é suportado e é recusado sem extração.

## Verificações executadas

95 verificações emquatro grupos:47 núcleo, 31 Chromium, 13 recuperação privada e4 contratosJSON. Zero falhas nesses checks. Não são 95 cenários metodológicos distintos nem homologação da stack oficial. Relatórios em evidence/.

Pilotos:12 componentes/blocos recuperados no Módulo 00; 32 arquivos-fonte no Open Space, comparados aos textos embutidos e aos hashes declarados. As duas recuperações preservaram ORIGINAL.html bit a bit e recusaram sobrescrita de destino. A entradaABRIR-V06permanece com4assets ausentes. Nenhum desses módulos foi convertido/homologadoF3.

## Como usar e reproduzir

Começar em LEIA_PRIMEIRO.md. Abrirpreview/index.htmlpara a préviaChromium, ou executar node tools/serve-preview.mjs. Comandos/limites em docs/COMANDOS.md; testes nativos em tests/core.test.mjs; QA em Python opcional paraPlaywright. Não executar scripts extraídos.

A prévia usa memória, não persistência automática; reloaddescarta a sessão. Diagnósticos incluem nomes/hashes/achados e devem ser tratados como privados. Jobnão inclui os arquivos nem autorização de publicação.

## Aprendizados e oportunidades consolidados

- Há pelo menos duas estruturas reais de fontes embutidas; um adaptador único que espere source_files perderia oMódulo 00.
- Recuperar texto, validar hash, reproduzir módulo e homologarF3são provas diferentes.
- Scanner estático precisa assumir incerteza deJS/CSSdinâmicos; ausência de alerta não significa segurança.
- Aprovações devem expirar ao alterar entradas; UIprecisa tratar corrida assíncrona e perda de foco.
- Compartilhar o núcleo entreCLI, prévia e futura entradaLit evita ummocksem vínculo com o produto.
- Dependências diretas fixadas semlocktransitivo não constituem build reproduzível.
- Publicar somente oartefato público, nunca a raiz do kit ou a recuperação privada.

## Próxima execução necessária

1. Disponibilizar runner Node 26 LTScom acesso autorizado ao registro e às dependências.
2. Gerar/revisarlockfile, licenças e integridade; executarTS, Ajv, Vitest eVite; corrigir incompatibilidades reais.
3. Construir os adaptadores de transformação e a base de componentes/tokens, sem confundir recuperação com migração.
4. Verificar operações de domínio antes/depois, host/suite, perfis de publicação/cache e navegadores restantes.
5. Só então produzir release F3V1 semsufixo CANDIDATO.

Não precisa reaprovar o escopo já aprovado. Execução/alteração emrepositório ou serviço externo requer destino e confirmação específicos. Não foi feito push, nem criado repositório/branch/workflow remoto.
