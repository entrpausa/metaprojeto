# Perfis de publicação — bloqueados nesta entrega

Caddy e Docker não estavam disponíveis. Os arquivos `.template` são propostas de configuração, não perfis executados ou prontos para publicar.

Não publicar a raiz do kit. Ela contém fontes, testes, evidências e documentação, não apenas o código público. Não montar entradas originais ou recuperações privadas no servidor.

`PUBLIC_HOST` deverá ser definido pelo operador. `CADDY_IMAGE` deverá ser resolvido, verificado e fixado por digest; nenhuma imagem flutuante foi apresentada como imutável. O arquivo `RELEASE_APPROVED` não foi criado. Isso impede usar o Dockerfile como se o build oficial estivesse aprovado.

Não executar ou alterar esses templates para esconder gates. Primeiro concluir build oficial, lockfile, parâmetros, regressões, licenças e revisão da fronteira pública; depois testar o perfil real. TLS local de teste não comprova domínio/DNS público.
