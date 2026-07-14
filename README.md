# Alvorecer Mentorias

Plataforma comercial da Alvorecer para venda de livros, recursos cristãos e
produtos da linha Kids.

## Arquitetura

- React, TypeScript e Vite no frontend;
- Cloudflare Pages para o site;
- Cloudflare R2 para imagens e mídias;
- Firebase Authentication e Cloud Firestore para usuários, catálogo e pedidos;
- Cloudflare Worker para integração segura com o checkout Asaas.

## Requisitos

- Node.js 20 ou superior;
- Java 21 ou superior para o Firestore Emulator;
- npm;
- acesso ao projeto Firebase correto;
- conta Cloudflare com acesso ao Pages, R2 e Workers.

## Configuração local

1. Copie `.env.example` para `.env.local`.
2. Preencha somente as variáveis públicas do frontend.
3. Instale as dependências com `npm install`.
4. Inicie o projeto com `npm run dev`.

Variáveis esperadas no frontend:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_PUBLIC_MEDIA_BASE_URL=
VITE_PAYMENT_API_BASE_URL=
```

O frontend não usa Firebase Storage. `VITE_PUBLIC_MEDIA_BASE_URL` deve apontar
para a origem pública do bucket R2.

## Comandos

```bash
npm run dev
npm run typecheck
npm run lint
npm run audit:catalog
npm run test:rules
npm run build
npm run preview
```

`audit:catalog` consulta o catálogo em modo somente leitura e informa
duplicidades, conflitos de seção, campos incompletos e imagens inacessíveis.

## Worker de pagamentos

O Worker está em `workers/asaas-checkout`. Os valores abaixo são secrets e
nunca devem ser gravados em `.env`, no código ou no GitHub:

```text
ASAAS_ACCESS_TOKEN
ASAAS_WEBHOOK_TOKEN
FIREBASE_WEB_API_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
```

O checkout deve ser aprovado no ambiente Sandbox antes de receber credenciais
de produção.

## Segurança

- Regras do Firestore: `firestore.rules`.
- Testes das regras: `tests/firestore.rules.test.ts`.
- Variáveis locais, `.dev.vars` e diretório `.wrangler` são ignorados pelo Git.
- O Worker recalcula preços pelo Firestore; valores enviados pelo navegador não
  devem ser considerados confiáveis.

## Plano de lançamento

O checklist, bloqueios e registro cronológico ficam em
[`docs/PLANO_LANCAMENTO.md`](docs/PLANO_LANCAMENTO.md).

O diagnóstico e o lote proposto para limpeza dos produtos ficam em
[`docs/AUDITORIA_CATALOGO.md`](docs/AUDITORIA_CATALOGO.md).
