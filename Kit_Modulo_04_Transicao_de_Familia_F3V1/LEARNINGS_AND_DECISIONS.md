# ADR_E_DRV_APRENDIZADOS_E_NEXT-STEPS

## ADR-001 — arquitetura aprovada preservada

ManterVite/TypeScript/Lit e ferramentas aprovadas como alvo oficial. Como faltam dependências/runtime de release, entregar uma prévia auxiliar gerada das fontes compartilhadas, combanner explícito e bloqueio de release. Não alegar que o gerador auxiliar éVite, nem que validouLit.

## ADR-002 — provas por camadas

Separar diagnóstico, recuperação, transformação, equivalência funcional, homologação e publicação. O retorno0 de inspect não é aprovaçãoF3. Gate de release continua fechado; recuperação gera family3Approved:false.

## ADR-003 — originais e privacidade

Nenhuma alteração na fonte recebida. Recuperações emdestino novo, comoriginal, hashes e manifesto privado. Não distribuir os legados ou conteúdos recuperados nesteZIP. Jobcarrega inventário/plano, não fonte nem autorização de publicação.

## ADR-004 — extensão sem adivinhação

Reconhecer duas estruturas observadas:source_files/source_manifest e componentes/blocos. Nomear componentes legados como blocos recuperados, não inventar nomes de arquivos originais. Casos desconhecidos eZIPficam bloqueados.

## DRV-001 — verificação

Núcleo testado com Node 20.20.2, prévia comChromium, recuperação de2amostras e contratos comPython jsonschema. Não executarNode 20como se fosse o runner oficial26. Não equipararWebKit aSafari/VoiceOver nem checks automáticos aWCAGcompleta.

## DRV-002 — regressões e aprendizados anteriores

Aplicados:fonte real antes de patch, invalidação de aprovação, estados explícitos, memória e backup separados, proveniência e consentimento não herdados, contagens de teste atuais, foco/IDs/instâncias e publicação separada do pacote privado. O gateOSTnão foi removido por conveniência.

## Próximos passos

Primeiro build oficial/lockfile e ajuste da camada tipada.Depois adaptadores de transformação e DS/host; emseguida QAde domínio/perfis e fechamento. UmaCIpreparada futuramente deve ser privada/autorizada quando necessário e receber apenas o material aprovado; nunca publicarinputs de pesquisa automaticamente.
