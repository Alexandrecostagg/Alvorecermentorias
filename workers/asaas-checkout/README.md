# Pagamentos Asaas

Este Worker cria um **Checkout hospedado pela Asaas** com PIX e cartão. A chave
da Asaas nunca entra no aplicativo web. O Worker recebe apenas IDs e
quantidades; ele consulta os preços atuais no Firestore antes de criar o pedido
e o checkout.

## Antes de publicar

1. O `APP_ORIGIN` já está apontando para o Pages público. Se você conectar um
   domínio próprio depois, atualize-o para esse domínio (sem barra no final).
   Para testes locais temporários, use `http://127.0.0.1:5173`.
2. No Asaas, comece pelo ambiente Sandbox e crie uma chave de API.
3. No Firebase Console, gere uma chave de conta de serviço em **Configurações
   do projeto > Contas de serviço**. Não envie esse JSON por chat nem o
   versione no Git.
4. No terminal, dentro desta pasta, grave os segredos. Cada comando pede o
   valor de forma privada:

   ```bash
   npx wrangler secret put ASAAS_ACCESS_TOKEN
   npx wrangler secret put ASAAS_WEBHOOK_TOKEN
   npx wrangler secret put FIREBASE_WEB_API_KEY
   npx wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON
   ```

5. Publique o Worker:

   ```bash
   npx wrangler deploy
   ```

6. Copie a URL publicada para `VITE_PAYMENT_API_BASE_URL` no `.env.local` do
   aplicativo e reinicie o servidor local.

## Webhook no Asaas

No painel Asaas, crie um webhook apontando para:

```
https://SEU-WORKER.workers.dev/webhooks/asaas
```

Use exatamente o valor de `ASAAS_WEBHOOK_TOKEN` como token de autenticação do
webhook. O Asaas o envia no cabeçalho `asaas-access-token`, que o Worker valida.
Configure somente os eventos de checkout/pagamento necessários (ao menos os
de pagamento confirmado, cancelamento e expiração). O Worker grava o ID de cada
evento para que reentregas não atualizem o pedido duas vezes.

## Ordem recomendada

Teste todo o fluxo no Sandbox primeiro. Só depois altere
`ASAAS_API_BASE_URL` para `https://api.asaas.com/v3`, troque a chave pelo token
de produção e crie o webhook de produção.
