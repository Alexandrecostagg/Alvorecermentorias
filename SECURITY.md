# Segurança e publicação das regras Firebase

As regras do Firestore ficam versionadas em `firestore.rules`. Elas substituem
a autorização apenas no navegador por uma política aplicada pelo Firebase.
Os arquivos públicos de produto serão hospedados no Cloudflare R2, não no
Firebase Storage.

## Antes de publicar

1. Confirme no Firestore que pelo menos um documento em `users/<uid>` já tem
   `role: "admin"`. As regras não permitem que um usuário se promova.
2. O checkout atual ainda cria pedidos diretamente do navegador. As regras
   exigem usuário autenticado, mantêm o pedido em `pending` e impedem que o
   cliente atualize o status, mas preço e pagamento só serão confiáveis quando
   forem calculados por uma função de backend.
3. Revise os produtos duplicados antes de executar qualquer carga de dados.
   A antiga tela de seeding foi retirada das rotas para impedir duplicações.

## Publicação manual

Depois de autenticar o Firebase CLI na sua máquina, publique somente as
regras revisadas:

```bash
firebase deploy --only firestore:rules
```

Não publique sem validar o acesso de um usuário comum e de um administrador
em ambiente controlado.
