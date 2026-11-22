# Dependencias e licencas

## Estado atual

O lockfile original foi preservado em 56b3447f32920f9d6dbd3406fbe298ee289aacba. Seu SHA-256 e c62cbb6f776cbb7f497da67a9997df05af938a9b2573d0263d72f5a03c5c7569.

No commit 4fafc0943f9b39e323778e732018b2e8321a5d96, a sonda 44982645115 e a auditoria 44982645127 passaram. A sonda usa Node 26.13.1 e pnpm 12.9.1, instala diretamente do lockfile versionado sem lifecycle ou pnpmfile e confere a preservacao das entradas. Dependencias ja foram baixadas no CI e o build oficial foi executado; nao houve deploy nem aprovacao de redistribuicao. A previa historica e o build oficial sao artefatos distintos.

## Bootstrap

Preservar os dois documentos YAML do lockfile: bootstrap e grafo do projeto. A action pnpm/action-setup fixada em 73e46992e05b19abd31f2f3c20e0e7370d762115 declara runtime node24 para si; os comandos Node do projeto usam 26.13.1. run_install e cache estao desabilitados. Esta revisao da definicao e da preservacao das entradas nao e auditoria dos binarios do bootstrap.

## Revisao pendente

O novo workflow kit04-dependencias.yml ainda precisa executar e ter seus resultados revisados. Ele inventaria o grafo emitido por pnpm list e os manifestos instalados, com pares unicos nome/versao e contextos de peers agregados. Nao equivale a inventario completo de todas as plataformas ou do bootstrap. Caminhos absolutos nao integram os relatorios publicados.

O lockfile inclui @emnapi/core e @emnapi/runtime em 2.0.0-beta.2. Classificar a cadeia e a presenca efetiva antes de concluir; pre-release nao prova vulnerabilidade.

Licencas declaradas e checksums de avisos na raiz dos pacotes nao substituem a revisao dos textos e avisos aplicaveis. NOASSERTION, UNKNOWN, UNLICENSED, manifestos ilegíveis, outras plataformas e vulnerabilidades permanecem pendencias explicitas. Verde no inventario nao encerra R2-03 nem autoriza release.

A politica de licenca do codigo proprio permanece a definir pelo responsavel. Nao se atribuiu licenca publica aos arquivos do usuario. GATES.json, homologacao F3, main e permissao de publicacao nao sao alterados por esta documentacao.
