# Guardrails

1. Originais intocados e saídas novas; sem sobrescrita.
2. Receber, analisar, recuperar, converter, homologar e publicar são estados diferentes.
3. Nenhum código importado é executado no intake.
4. A análise HTML é scanner conservador, não parser completo/AST de JS/CSS nem prova de ausência de comportamento malicioso.
5. SHA comprova correspondência de bytes, não autoria/confiança do remetente.
6. Jobs não carregam fontes e não autorizam publicação; diagnósticos ainda contêm metadados privados.
7. Memória local não é backup; namespaces não são fronteira de segurança.
8. Quotas/limites/erros explícitos; ZIP ainda bloqueado.
9. Perfis não executados ficam não verificados; nenhum resultado humano ou metodológico é herdado.
10. Manter arquitetura aprovada; prévia auxiliar não equivale ao build oficial.
