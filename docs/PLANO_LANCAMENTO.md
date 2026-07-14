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
- [ ] Regras do projeto Firebase `alvorecermentorias` verificadas e publicadas.
- [ ] Worker `alvorecermentorias-payments` publicado.
- [ ] Checkout Asaas validado em Sandbox.
- [ ] Testes automatizados e fluxo completo de compra implementados.
- [ ] Conteúdo, privacidade, contatos e links definitivos revisados.

## Etapa 1 — Segurança, escopo e configuração

Status: **em andamento**

- [x] Registrar o plano e a linha de base técnica.
- [ ] Confirmar acesso do Firebase CLI ao projeto `alvorecermentorias` — bloqueado: a conta ativa `infinitygravitycode@gmail.com` só enxerga `alvorecerflutterapp`.
- [ ] Testar as regras do Firestore no Emulator.
- [ ] Publicar as regras do Firestore no projeto correto.
- [x] Atualizar dependências com vulnerabilidades conhecidas.
- [x] Resolver erros de lint que afetem o código ativo.
- [x] Remover configurações geradas, duplicadas ou obsoletas do Git.
- [x] Ocultar ou desativar promessas e rotas fora do MVP.

Critério de conclusão: build, typecheck e lint aprovados, regras testadas e
publicadas e nenhuma funcionalidade inexistente apresentada como disponível.

## Etapa 2 — Catálogo, conteúdo e UX essencial

Status: **em andamento**

- [ ] Remover produtos duplicados no Firestore.
- [ ] Substituir imagens quebradas por arquivos do R2.
- [x] Criar navegação móvel.
- [ ] Transformar filtros móveis em painel recolhível.
- [ ] Corrigir ou remover ordenação e favoritos sem função.
- [ ] Revisar modal e detalhes de produto.
- [ ] Preencher contato, endereço e redes oficiais.
- [ ] Publicar Política de Privacidade e Termos de Uso.
- [ ] Otimizar imagens grandes e retirar duplicação desnecessária no Pages.

Critério de conclusão: loja utilizável em desktop e celular, catálogo íntegro,
sem imagens quebradas, dados provisórios ou controles sem função.

## Etapa 3 — Checkout Asaas em Sandbox

Status: **não iniciada**

- [ ] Corrigir compensação de falhas na criação do checkout.
- [ ] Tornar o webhook idempotente e recuperável.
- [ ] Modelar pagamento aprovado, cancelado, expirado e estornado.
- [ ] Configurar secrets do Worker sem gravá-los no Git.
- [ ] Publicar `alvorecermentorias-payments`.
- [ ] Configurar o webhook no Asaas Sandbox.
- [ ] Configurar `VITE_PAYMENT_API_BASE_URL` e republicar o frontend.
- [ ] Confirmar o pagamento pelo webhook, não apenas pela URL de retorno.

Critério de conclusão: uma compra Sandbox cria checkout, recebe webhook,
atualiza o pedido corretamente e suporta repetição segura do mesmo evento.

## Etapa 4 — Testes e operação

Status: **não iniciada**

- [ ] Criar testes das regras do Firestore.
- [ ] Criar testes unitários para cálculo e transições de pedidos.
- [ ] Testar cadastro, login, recuperação de senha e perfil.
- [ ] Testar produto físico e digital.
- [ ] Testar PIX e cartão no Sandbox.
- [ ] Testar cancelamento, expiração, falha e webhook duplicado.
- [ ] Testar permissões de cliente e administrador.
- [ ] Adicionar logs e procedimento de suporte/estorno.
- [ ] Configurar verificação automática antes do deploy.

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

- conta Google com acesso ao Firebase `alvorecermentorias`;
- credenciais Asaas Sandbox e produção;
- service account Firebase entregue como secret ao Worker;
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

## Regras de trabalho

- Nenhum secret deve ser enviado ao GitHub.
- Cada etapa concluída deve atualizar este documento.
- Build, typecheck e testes relevantes devem rodar antes de cada commit.
- Alterações devem ser pequenas, verificáveis e fáceis de reverter.
- Produção só recebe checkout após aprovação completa no Sandbox.
