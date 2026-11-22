# Metaprojeto

Kits e módulos do Ateliê Metaprojeto, com desenvolvimento da Família 3 para uso local e web, migração de legados, componentes compartilhados, testes e documentação rastreável.

## Estado atual

Kit 04 candidato: reconhece estruturas legadas e recupera fontes privadamente, mas ainda não transforma os módulos em F3. OST pausada. Desenvolvimento em f3/kit-04-consolidacao; não integrar o PR nº 1 à main antes da revisão.

O repositório permanece público por decisão do usuário. Isso não autoriza inserir dados privados no código, logs ou artefatos, nem publicar módulos de pesquisa.

## Por onde começar

- [Instruções do candidato](Kit_Modulo_04_Transicao_de_Familia_F3V1/LEIA_PRIMEIRO.md)
- [Handoff original](Kit_Modulo_04_Transicao_de_Familia_F3V1/HANDOFF.md)
- [Plano original R0–R7](Kit_Modulo_04_Transicao_de_Familia_F3V1/PLANO_DAS_RODADAS.md)
- [Auditoria inicial](docs/RETOMADA_AUDITORIA_F3.md)
- [Estado atual de R2, custos e política pública](docs/R2_FUNDACAO.md)

A auditoria inicial passou no commit f629e53. A primeira sonda R2, commit b388149, foi ignorada pelo bloqueio de privacidade, não aprovada. O ajuste público ainda precisa de uma nova execução real.

A sonda usa ubuntu-24.04 padrão, sem larger runners, cache, merge ou deploy. Logs são públicos. O artefato público é limitado a lockfile e três arquivos de metadados, até 1 MiB antes de compactar, por sete dias. Não contém a árvore inteira do runner, dist, node_modules ou inputs reais.

Computação pública padrão é gratuita; armazenamento tem regras próprias. Verde nessa sonda não fecha R2 nem homologa F3: a tipagem do núcleo e os demais gates continuam pendentes.
