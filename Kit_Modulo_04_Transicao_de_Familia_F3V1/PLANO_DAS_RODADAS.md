# Plano das rodadas — cópia consolidada da versão aprovada

Status:plano aprovado em 21/11/2026às 12:00-03:00; base visual aprovada às 12:03. Implementação atual é candidata e não encerra o módulo.

## Objetivo e contrato

Construir Kit_Modulo_04_Transicao_de_Familia_F3V1 para trazer legados de diferentes famílias a uma base modular comum. F3 exige distribuição independente e conjunta, execução web/local servida/servidor, dados e método preservados, designsystem/serviços padronizados, testes, evidências e fronteira de publicação. Arquivo incompleto/desconhecido recebe diagnóstico/adaptação, não selo indevido.

Stack aprovada:TypeScript, Vite, HTML semântico/Web Components/Lit, pnpm workspaces, tokens DTCG 2025.10/Storybook, JSON Schema/Ajv, IndexedDBopt-in, Vitest/Playwright eCaddycomo referência. Node LTS fixado; candidato de release26LTS. Portabledireto é perfil adicional por módulo, não garantia universal. Núcleo compartilhado/adaptadores versionados em vez de forks ou reescrita integral obrigatória.

Interfaceweb/local monta plano e job; build/testes completos emrunner local/CI autorizada. Não inclui serviço público anônimo de execução de ZIPs, nem upload automático, sync/CRDT, contas/SSO, desktopnativo ouIAexterna. OST continua pausada e fora do piloto.

## Rodadas

| Rodada | Escopo aprovado | Estado desta entrega |
|---|---|---|
| R0 |Pesquisa, auditoria e plano |Realizada na rodada anterior; repertório consolidado.|
| R1 |Validação do resumo executivo |Aprovada pelo usuário.|
| R2 |Wireframe, contratos, stack e DS mínimo |Base aprovada; fonte/contratos e prévia implementados; build oficial/DS completo pendentes.|
| R3 |Diagnóstico, adaptadores, dry-run e planos |Núcleo funcional para reconhecimento/recuperação privada; ZIP/AST completo e migração ainda pendentes.|
| R4 |Piloto legado00/Open SpaceF2, fixturemultifile e negativos |Diagnóstico/recuperação dos dois legados e bloqueio de assets verificados; não equivalência funcional F3.|
| R5 |Builds independente/suite/local/web/servidor eportablecondicional |Somente prévia auxiliar e duas instâncias técnicas; sem distribuição oficial de módulos convertidos.|
| R6 |Segurança, privacidade, a11y e reprodução |Checks auxiliares executados; matriz oficial/revisão humana pendentes.|
| R7 |Consolidação, documentação, pacoteF3V1 |Pacote candidato de continuidade; release F3 bloqueado.|

## Gates e entrega

Gates incluem originais intactos, assets resolvidos, IDs/refs/dados/método equivalentes, versões/lockfile corretos, perfis reais, headers/cache/quotas/rollback, testes nos ambientes declarados e revisão de publicação. Candidato não herda a aprovação de testes anteriores; schema/hash não é certificação de autoria, método, WCAG ou consentimento.

Entrega final só com fontes atuais, artefatos/contratos/testes/evidências eHANDOFF.md, CHANGELOG_E_BACKLOG.md, LEARNINGS_AND_DECISIONS.md, GATEKEEPING.md, PLANO_DAS_RODADAS.md. Reter assets antigos em servidor pode ser política operacional limitada; isso não significa duplicar versões obsoletas noZIP.

## Ajuste de execução registrado

O ambiente disponível temNode 20.20.2 eChromium, mas não dependências da stack oficial, Caddy, Docker, FirefoxouWebKit. O acesso de rede do executor não permite instalar pacotes. Por isso, foi produzido um harness/prévia do núcleo/componente compartilhado, sem substituir o projeto Vite/Lit. Essa limitação bloqueia o fechamento, não autoriza fingir build, lockfile ou deploy.
