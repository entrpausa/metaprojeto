# Gatekeeping — candidato, não release F3

Estado geral:BLOQUEADO. Plano/base aprovados não equivalem a software, domínio, publicação ou segurança aprovados.

| Gate | Escopo | Estado |
|---|---|---|
|G00|Plano e base visual|passed|
|G01|Núcleo auxiliar e jobs|passed|
|G02|Prévia Chromium/local/file URL|passed|
|G03|Recuperação privada das duas estruturas|passed|
|G04|Contratos JSON em fixtures|passed_python_only|
|G05|Build Vite/Lit/TypeScript/Ajv|blocked_not_executed|
|G06|Lockfile/compatibilidade/licenças transitivas|blocked_not_executed|
|G07|Transformação dos métodos e equivalência funcional|blocked_not_implemented|
|G08|Suite de módulos convertidos|blocked_not_implemented|
|G09|Caddy/Docker/publicação HTTPS|blocked_not_executed|
|G10|PWA/offline upgrade e armazenamento persistente|blocked_not_implemented|
|G11|Firefox/WebKit/Safari/assistivas|blocked_not_executed|
|G12|WCAG humana/segurança completa|blocked_not_executed|

## Regras de promoção

Não emitirF3 completo enquanto os gates obrigatórios não tiverem evidências reais e atuais. O CLI release-checkretorna2neste candidato e não deve ser alterado apenas para ficar verde. Não há selo, assinatura ou certificação externa.

Dois componentes na prévia são prova de isolamento lógico de instância, não de convivência de métodos migrados. File URL Chromiumé prova da prévia, não de todos os módulos/navegadores. Testar HTTPauxiliar não validaCaddy/TLS público. Templates não executados não são deploy pronto.

Mudanças relevantes devem invalidar aprovações/versionar contratos e repetir QA. Piloto humano, auditoria de segurança/metodologia e autorização de circulação continuam separados do software.
