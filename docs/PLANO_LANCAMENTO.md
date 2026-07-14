# Plano de lançamento — Alvorecer Mentorias

Atualizado em: 14 de julho de 2026  
Objetivo: colocar no ar um MVP comercial confiável no menor prazo possível.

## Escopo do MVP

O primeiro lançamento será concentrado em:

- página inicial e páginas institucionais essenciais;
- loja e linha Kids;
- autenticação e perfil do cliente;
- carrinho e checkout Asaas;
- histórico de pedidos;
- administração de produtos e pedidos;
- mídia no Cloudflare R2, sem Firebase Storage.

Cursos, mentorias, doações, favoritos e outras jornadas incompletas não devem
ser apresentadas como disponíveis até possuírem fluxo funcional de ponta a ponta.

## Estado inicial

- [x] Repositório local sincronizado com `origin/main` no commit `9e1de24`.
- [x] Frontend publicado no Cloudflare Pages.
- [x] Firebase Authentication e Firestore integrados no frontend.
- [x] Estrutura do Worker de checkout Asaas criada.
- [x] Regras do projeto Firebase `alvorecermentorias` verificadas e publicadas.
- [x] Worker `alvorecermentorias-payments` publicado.
- [x] Checkout Asaas validado em Sandbox.
- [x] Testes automatizados de regras e pagamentos implementados.
- [x] Fluxo completo de compra validado no Sandbox para PIX e cartão.
- [ ] Conteúdo, privacidade, contatos e links definitivos revisados.

## Etapa 1 — Segurança, escopo e configuração

Status: **concluída**

- [x] Registrar o plano e a linha de base técnica.
- [x] Confirmar acesso do Firebase CLI ao projeto `alvorecermentorias`.
- [x] Testar as regras do Firestore no Emulator.
- [x] Publicar as regras do Firestore no projeto correto.
- [x] Atualizar dependências com vulnerabilidades conhecidas.
- [x] Resolver erros de lint que afetem o código ativo.
- [x] Remover configurações geradas, duplicadas ou obsoletas do Git.
- [x] Ocultar ou desativar promessas e rotas fora do MVP.

Critério de conclusão: build, typecheck e lint aprovados, regras testadas e
publicadas e nenhuma funcionalidade inexistente apresentada como disponível.

## Etapa 2 — Catálogo, conteúdo e UX essencial

Status: **em andamento**

- [x] Remover produtos duplicados no Firestore.
- [ ] Substituir imagens quebradas por arquivos do R2.
- [x] Criar navegação móvel.
- [x] Transformar filtros móveis em painel recolhível.
- [x] Corrigir ou remover ordenação e favoritos sem função.
- [x] Revisar modal e detalhes de produto.
- [x] Preencher o endereço automaticamente a partir de um CEP válido.
- [ ] Preencher contato, endereço e redes oficiais.
- [ ] Publicar Política de Privacidade e Termos de Uso.
- [ ] Otimizar imagens grandes e retirar duplicação desnecessária no Pages.

Critério de conclusão: loja utilizável em desktop e celular, catálogo íntegro,
sem imagens quebradas, dados provisórios ou controles sem função.

## Etapa 3 — Checkout Asaas em Sandbox

Status: **em andamento**

- [x] Corrigir compensação de falhas na criação do checkout.
- [x] Tornar o webhook idempotente e recuperável.
- [x] Modelar checkout pago, cancelado e expirado.
- [ ] Modelar estorno após a validação do fluxo básico.
- [x] Configurar secrets do Worker sem gravá-los no Git.
- [x] Publicar `alvorecermentorias-payments`.
- [x] Configurar o webhook no Asaas Sandbox.
- [x] Configurar `VITE_PAYMENT_API_BASE_URL` e republicar o frontend.
- [x] Permitir que o cliente escolha PIX ou cartão antes de abrir a Asaas.
- [x] Confirmar o pagamento pelo webhook, não apenas pela URL de retorno.

Critério de conclusão: uma compra Sandbox cria checkout, recebe webhook,
atualiza o pedido corretamente e suporta repetição segura do mesmo evento.

## Etapa 4 — Testes e operação

Status: **em andamento**

- [x] Criar testes das regras do Firestore.
- [x] Criar testes unitários para cálculo e transições de pedidos.
- [x] Implementar recuperação de senha e mensagens seguras de autenticação.
- [x] Autorizar o domínio do Cloudflare Pages para login com Google.
- [ ] Testar cadastro, login, recuperação de senha e perfil.
- [ ] Testar produto físico e digital.
- [x] Testar PIX e cartão no Sandbox.
- [ ] Testar cancelamento, expiração, falha e webhook duplicado.
- [ ] Testar permissões de cliente e administrador.
- [ ] Adicionar logs e procedimento de suporte/estorno.
- [ ] Configurar verificação automática antes do deploy.
- [x] Exibir ficha operacional do pedido com cliente, itens e endereço completo.
- [x] Implementar o fluxo `Pago → Em separação → Enviado → Entregue`.
- [x] Registrar transportadora, código e link de rastreio no pedido.
- [x] Exibir o rastreamento na área do cliente em tempo real.
- [ ] Integrar cotação, etiqueta e rastreamento automático com o Melhor Envio.

Critério de conclusão: matriz crítica aprovada e erros operacionais visíveis
nos logs sem expor dados pessoais ou segredos.

## Etapa 5 — Produção e lançamento controlado

Status: **não iniciada**

- [ ] Configurar credenciais Asaas de produção.
- [ ] Registrar e validar webhook de produção.
- [ ] Publicar frontend e Worker finais.
- [ ] Executar compra real de valor baixo.
- [ ] Verificar pedido, pagamento, atendimento e eventual estorno.
- [ ] Monitorar manualmente as primeiras vendas.
- [ ] Registrar a versão de lançamento no Git.

Critério de conclusão: compra real confirmada de ponta a ponta e operação com
responsável, logs e procedimento de contingência definidos.

## Bloqueios externos

Estes itens dependem de acesso ou decisão do proprietário:

- credenciais Asaas de produção;
- dados oficiais de contato, endereço, redes, Termos e Privacidade;
- decisão sobre domínio próprio e quais áreas ficarão visíveis no MVP.

## Registro de execução

| Data | Etapa | Registro | Estado |
|---|---|---|---|
| 14/07/2026 | Diagnóstico | Auditoria de UX, rotas, integrações, build, segurança e publicação concluída. | Concluído |
| 14/07/2026 | Planejamento | Escopo do MVP, etapas, bloqueios e critérios de conclusão registrados. | Concluído |
| 14/07/2026 | Etapa 1 | Iniciada a preparação de segurança e configuração. | Em andamento |
| 14/07/2026 | Firebase | Conta ativa verificada; sem acesso ao projeto `alvorecermentorias`. | Bloqueio externo |
| 14/07/2026 | Dependências | Firebase e React Router atualizados; auditoria de produção passou de 5 para 0 vulnerabilidades. | Concluído |
| 14/07/2026 | Qualidade | Lint reduzido de 24 erros para 0; restam 2 avisos não bloqueantes de Fast Refresh. | Concluído |
| 14/07/2026 | Build | TypeScript e build de produção aprovados com Node 20.19.0. | Concluído |
| 14/07/2026 | Limpeza | Configuração Vite consolidada e arquivos gerados, ambientes fictícios e páginas legadas removidos. | Concluído |
| 14/07/2026 | Escopo MVP | Cursos, mentorias, doação e links fictícios retirados da navegação pública; home focada em Loja e Kids. | Concluído |
| 14/07/2026 | UX móvel | Menu responsivo implementado com rotas públicas e opções autenticadas. | Concluído |
| 14/07/2026 | Documentação | README refeito com arquitetura, ambiente, comandos e política de secrets. | Concluído |
| 14/07/2026 | Git | Primeiro lote do plano salvo no commit `fd59ea1` e enviado para `origin/main`. | Concluído |
| 14/07/2026 | Firebase | Acesso de `infinitygravitycode@gmail.com` ao projeto `alvorecermentorias` confirmado. | Concluído |
| 14/07/2026 | Testes de regras | Firestore Emulator executado com Java 21; 12 de 12 testes aprovados. | Concluído |
| 14/07/2026 | Deploy Firebase | Regras compiladas e publicadas no projeto `alvorecermentorias`. | Concluído |
| 14/07/2026 | Catálogo | Auditoria somente leitura encontrou 24 documentos, 11 pares duplicados e 1 conflito de seção. | Concluído |
| 14/07/2026 | Identidade de produto | Frontend corrigido para sempre usar o ID real do documento Firestore no carrinho e checkout. | Concluído |
| 14/07/2026 | UX da loja | Busca, ordenação, filtros móveis, estados vazio/erro e modal de produto revisados. | Concluído |
| 14/07/2026 | Imagens | Fallback visual implementado para URLs indisponíveis; três arquivos próprios ainda precisam ser enviados ao R2. | Parcial |
| 14/07/2026 | Limpeza de dados | Lote exato de 12 documentos registrado em `AUDITORIA_CATALOGO.md`; exclusão aguarda confirmação. | Aguardando aprovação |
| 14/07/2026 | Limpeza de dados | Backup validado criado e 12 registros excedentes removidos; catálogo final com 6 itens de Loja e 6 de Kids. | Concluído |
| 14/07/2026 | Worker Asaas | Payload alinhado à API atual, `User-Agent` incluído e compensação de falhas implementada. | Concluído |
| 14/07/2026 | Webhook Asaas | Reconciliação por checkout, idempotência recuperável e proteção contra regressão de pedido pago implementadas. | Concluído |
| 14/07/2026 | Testes Asaas | Sete testes unitários adicionados para carrinho, endereço, payload, token e transições financeiras. | Concluído |
| 14/07/2026 | Ferramentas | Projeto migrado para Node 22, Vite 8 e Wrangler 4.110; auditoria npm com zero vulnerabilidades. | Concluído |
| 14/07/2026 | Cloudflare | Conta confirmada e Worker de pagamentos criado no ambiente `workers.dev`. | Concluído |
| 14/07/2026 | Deploy Worker | `alvorecermentorias-payments` publicado em `workers.dev`; rota pública verificada. | Concluído |
| 14/07/2026 | Secrets Worker | Os quatro secrets Firebase/Asaas foram configurados na Cloudflare sem versionar ou persistir seus valores no projeto. | Concluído |
| 14/07/2026 | Asaas Sandbox | Chave exclusiva `Alvorecer Mentorias Sandbox` criada e vinculada ao secret `ASAAS_ACCESS_TOKEN`. | Concluído |
| 14/07/2026 | Webhook Sandbox | Webhook `Alvorecer Mentorias - Checkout` criado, ativo, em API v3 e envio sequencial para o Worker publicado. | Concluído |
| 14/07/2026 | Eventos Sandbox | `CHECKOUT_PAID`, `CHECKOUT_CANCELED` e `CHECKOUT_EXPIRED` habilitados; fila de sincronização ativa. | Concluído |
| 14/07/2026 | Segurança Webhook | Token compartilhado somente via secrets; chamada sem credencial rejeitada pela rota publicada com HTTP 401. | Concluído |
| 14/07/2026 | Firebase Auth | Provedor Google confirmado como ativo e `alvorecermentorias-web.pages.dev` adicionado aos domínios autorizados sem remover os domínios existentes. | Concluído |
| 14/07/2026 | Recuperação de senha | Fluxo por e-mail implementado em português, com resposta que não revela se a conta existe e tratamento amigável de erros. | Concluído |
| 14/07/2026 | Testes de autenticação | Testes unitários adicionados para login Google, credenciais e recuperação de senha. | Concluído |
| 14/07/2026 | UX do checkout | Consulta de CEP com preenchimento automático, fallback entre dois serviços gratuitos e orientação para CEP inexistente. | Concluído |
| 14/07/2026 | Forma de pagamento | PIX e cartão transformados em seletores; o método escolhido limita as opções do checkout hospedado pela Asaas. | Concluído |
| 14/07/2026 | Integração do frontend | URL pública do Worker configurada no build do Pages para iniciar o checkout Sandbox. | Concluído |
| 14/07/2026 | Compatibilidade do carrinho | Worker preparado para migrar IDs numéricos legados para os documentos atuais do catálogo antes de criar o pedido. | Concluído |
| 14/07/2026 | Dados do pagador | `customerData` enviado à Asaas somente com CPF válido; sem documento no perfil, a coleta fica no checkout hospedado. | Concluído |
| 14/07/2026 | Compra Sandbox PIX | Checkout pago, webhook `CHECKOUT_PAID` processado e pedido confirmado no Firestore. | Concluído |
| 14/07/2026 | Compra Sandbox cartão | Pagamento confirmado no checkout hospedado, webhook processado e pedido atualizado no Firestore. | Concluído |
| 14/07/2026 | Operação de pedidos | Ficha do cliente, endereço, itens, filtros e exportação operacional adicionados ao painel. | Concluído |
| 14/07/2026 | Expedição | Fluxo de separação, envio, transportadora, rastreio e entrega implementado sem permitir aprovação manual de pagamento. | Concluído |
| 14/07/2026 | Área do cliente | Pedidos passam a atualizar em tempo real e exibem separação, envio e link de rastreamento. | Concluído |
| 14/07/2026 | Logística | Melhor Envio escolhido para a próxima integração por cobrir cotação, compra, etiqueta e rastreamento via API. | Planejado |

## Regras de trabalho

- Nenhum secret deve ser enviado ao GitHub.
- Cada etapa concluída deve atualizar este documento.
- Build, typecheck e testes relevantes devem rodar antes de cada commit.
- Alterações devem ser pequenas, verificáveis e fáceis de reverter.
- Produção só recebe checkout após aprovação completa no Sandbox.
