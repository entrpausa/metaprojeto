# Metaprojeto

Kits e módulos do Ateliê Metaprojeto, com desenvolvimento da Família 3 para uso local e web, migração de legados, componentes compartilhados, testes e documentação rastreável.

## Estado atual

O Kit 04 é candidato, não um kit F3 homologado. Reconhece estruturas legadas e recupera fontes privadamente, mas ainda não transforma os módulos em F3. OST permanece pausada.

A evolução acontece na branch f3/kit-04-consolidacao. Não integrar o PR nº 1 à main antes da revisão.

## Por onde começar

- [Instruções do candidato](Kit_Modulo_04_Transicao_de_Familia_F3V1/LEIA_PRIMEIRO.md)
- [Handoff original](Kit_Modulo_04_Transicao_de_Familia_F3V1/HANDOFF.md)
- [Plano original R0–R7](Kit_Modulo_04_Transicao_de_Familia_F3V1/PLANO_DAS_RODADAS.md)
- [Auditoria inicial](docs/RETOMADA_AUDITORIA_F3.md)
- [Retomada R2 e referência dos 65 checklists](docs/R2_FUNDACAO.md)

Os documentos internos registram a entrega original; os relatórios da retomada registram verificações posteriores.

## Verificações

A auditoria inicial passou no commit f629e53, na execução Actions 44970878072, com os testes nativos sob Node 26. Não realizou o build oficial.

A nova sonda R2 prepara instalação controlada e primeira execução dos comandos oficiais. Verifique sua conclusão real na aba Actions. Mesmo verde não fecha R2 nem homologa F3: a cobertura de tipos do núcleo ainda precisa ser corrigida e comprovada.

A sonda guarda lockfile e diagnósticos em artefato privado por sete dias; não faz commit desses resultados, publicação ou merge. Os HTMLs originais dos pilotos não estão incluídos no candidato. Não enviar entrevistas, backups, credenciais ou dados privados para completar testes.
