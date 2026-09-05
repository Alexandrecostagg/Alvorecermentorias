# Retomada — Alvorecer Mentorias

Atualizado em 04/09/2026, a partir do histórico fornecido pelo proprietário e
da inspeção do commit `1e3ba0f`.

## Direção de trabalho

A próxima frente é tornar a mentoria operacional, preservando a loja, Kids,
pedidos e biblioteca existentes. Este plano passa a orientar a retomada técnica;
o roadmap editorial de julho continua disponível como backlog de produtos.

Trabalhar somente em `/Users/alexandregomesdacosta/Documents/Projetos_DEV/Alvorecermentorias`.
Entregar por jornadas completas, com persistência, permissões, estados de erro e
validação. Uma tela que apenas simula ações não será registrada como concluída.
Cada entrega deve registrar o que funciona localmente, o que foi publicado e
o que ainda depende de conteúdo ou decisão do proprietário.

## Linha de base confirmada

- Firebase existente: `alvorecermentorias`; app web `AlvorecerMentorias`.
- Acesso ao aplicativo confirmado pelo Firebase CLI; configuração pública
  recuperada para `.env.local`, ignorado pelo Git.
- Consulta pelo SDK cliente ao Firestore aprovada: 12 produtos (6 Loja, 6 Kids),
  sem duplicidades ou campos básicos incompletos. Duas imagens retornaram 404;
  uma terceira teve falha de conexão. Não houve alteração no catálogo.
- O frontend de mentoria usa mocks. O CRUD administrativo altera apenas estado
  React e perde alterações ao recarregar a página.
- `/mentoring-checkout` é chamado pelo frontend, mas não existe no Worker.
- As regras atuais não definem acesso às coleções de mentoria.
- Os programas e materiais existem como descrições no código; isso não comprova
  que apostilas, planilhas, sessões ou demais entregáveis tenham sido produzidos.
- A auditoria anterior encontrou o site publicado sem variáveis de Firebase e
  pagamento. Configurar `.env.local` não corrige automaticamente esse deployment.
- As 45 verificações existentes passaram na auditoria inicial; não cobrem a
  jornada de mentoria. A instalação atual informa 13 alertas de dependências.

## Sequência de entregas

### 1. Ambiente, acesso e publicação confiável

- [x] Recuperar a configuração pública do Firebase existente.
- [x] Configurar `.env.local` sem versionar seus valores.
- [x] Confirmar a leitura do catálogo pelo SDK cliente.
- [x] Exigir variáveis obrigatórias e recusar configuração de demonstração no build.
- [x] Validar TypeScript e build com Node 22; confirmar IDs do Firebase e URL do
  Worker no bundle gerado. Lint: zero erros, dois avisos preexistentes.
- [x] Testar o build com `VITE_FIREBASE_API_KEY` vazia: falha explícita antes de
  compilar os arquivos do frontend, sem alterar o `.env.local`.
- [ ] Revisar as variáveis de Production/Preview no Cloudflare Pages e publicar
  o build configurado; confirmar o resultado servido pelo domínio público.
- [ ] Validar login Google, cadastro por e-mail e recuperação de senha com uma
  conta de teste autorizada, incluindo perfil e papel administrativo.
- [ ] Validar CORS: o Worker atual permite a origem pública configurada; login
  local não comprova que checkout e biblioteca funcionarão a partir de localhost.

Aceite: login e catálogo funcionando no ambiente publicado e build sem
configuração rejeitado antes de gerar artefatos.

### 2. Administração e catálogo reais de mentoria

- Criar `mentors` e `mentoringPrograms`, tipos e camada de acesso compartilhada.
- Implementar regras e testes de permissões antes de liberar gravações.
- Persistir criar, editar, arquivar e consultar; verificar após recarregar.
- Catalogar apenas perfis confirmados. Preparar Alexandre Gomes da Costa como
  primeiro mentor proposto, sem inventar diplomas, títulos, avaliações ou histórico.
- Programas devem ter estado de rascunho/publicação. O público lê somente ofertas
  publicadas; o administrador gerencia os rascunhos.
- Substituir os mocks do catálogo e do perfil pelos mesmos dados do painel.
- Não excluir um mentor/programa com sessões ou compras vinculadas; arquivar.

Aceite: uma alteração administrativa persiste e aparece no catálogo quando
publicada; clientes comuns não conseguem editar mentores ou programas.

### 3. Agenda e compra em Sandbox

- Definir disponibilidade, fuso, duração, bloqueio temporário e política de
  cancelamento antes de disponibilizar horários para venda.
- Criar `mentoringSessions` e `/mentoring-checkout` no Worker.
- Calcular preço e validar programa, mentor e horário no servidor.
- Impedir reserva dupla por operação atômica; liberar reservas expiradas.
- Confirmar pagamento exclusivamente pelo webhook; tratar repetição, cancelamento,
  expiração e falha parcial entre cobrança e reserva.
- Relacionar pagamento, comprador, programa e sessão por IDs persistidos.

Aceite: compra Sandbox confirma uma sessão do comprador correto; repetir o
webhook não duplica a sessão; dois compradores não ocupam a mesma vaga.

### 4. Acompanhamento do mentorado e operação

- Dashboard consulta apenas sessões autorizadas do usuário, sem `|| true`.
- Incluir navegação para minhas mentorias e notificações quando houver dados reais.
- Disponibilizar link real de reunião somente às pessoas autorizadas.
- Criar `mentoringReviews` vinculadas a sessões concluídas, sem notas fictícias.
- Implementar notificações, reagendamento e acompanhamento administrativo.
- Produzir e vincular os materiais efetivamente incluídos em cada oferta.

Aceite: mentorado vê suas sessões, acessa os materiais devidos e acompanha as
alterações; outro cliente não acessa os dados dessa jornada.

### 5. Expansão após o fluxo básico

Páginas de trilhas, blog/devocionais, integração de calendário, grupos ao vivo,
matching e resumos por IA ficam para depois da jornada individual validada.
O código atual dessas funções serve como referência de interface, não como
evidência de integração pronta.

## Conteúdo e oferta comercial

Propostas recebidas, ainda sujeitas à validação editorial e operacional:

| Programa | Duração proposta | Preço proposto |
| --- | --- | --- |
| Liderança Cristã | 12 semanas | R$ 599 |
| Vida Espiritual | 8 semanas | R$ 449 |
| Finanças Bíblicas | 6 semanas | R$ 349 |

O código também anuncia sessão avulsa de R$ 99, pack de quatro sessões e clube
mensal. Antes de cobrar, consolidar o modelo de venda: programa completo, sessão
avulsa ou assinatura, com entregáveis e política operacional consistentes.

As afirmações de alta demanda, lacunas de mercado e urgência vieram sem fontes;
tratá-las como hipóteses, a validar por pesquisa e conversas com o público.
Mentoria pastoral não será anunciada como tratamento clínico de traumas ou
transtornos. Depoimentos, qualificações e números só entram após confirmação.

## Verificação e publicação

- Rodar build, lint e testes relacionados antes de consolidar cada entrega.
- Atualizar dependências com os alertas identificados em um lote verificável.
- Introduzir CI para repetir as verificações antes de publicar.
- Publicar somente fluxos cujo escopo público corresponda ao que foi validado.
- Manter pagamentos em Sandbox até o aceite operacional e a configuração de
  produção; não gerar cobranças reais como teste implícito.
- Registrar commit/deployment e evidência após cada publicação.

## Ponto de pausa solicitado pelo proprietário

Trabalho pausado a pedido do proprietário para tratar de outro projeto.

- Repositório único de trabalho: `/Users/alexandregomesdacosta/Documents/Projetos_DEV/Alvorecermentorias`.
- Base Git: `main`, commit `1e3ba0f`.
- Arquivos desta entrega de retomada: `vite.config.ts`, `README.md`,
  `docs/PLANO_LANCAMENTO.md` e este `docs/PLANO_RETOMADA.md`.
- O proprietário solicitou o commit local desta entrega após registrar a pausa;
  o envio ao GitHub permanece pendente.
- `.env.local` configurado e ignorado pelo Git; dependências instaladas.
- Build configurado, TypeScript e lint verificados; teste de variável ausente
  confirmou o bloqueio. Consulta real ao catálogo aprovada.
- Nenhum deploy realizado nesta retomada; login interativo ainda não validado.
- Próximo passo: revisar a configuração do Cloudflare Pages, gerar/publicar o
  build configurado e validar catálogo, login e acesso administrativo.
- Depois: implementar persistência e regras de mentores/programas conforme a
  sequência acima. Não considerar os mocks como funções concluídas.

Ao retomar, conferir o estado do Git e ler este plano antes de editar. Preservar
eventuais alterações locais e a configuração existente.

## Referências técnicas

- [Variáveis e modos do Vite](https://vite.dev/guide/env-and-mode): variáveis
  públicas são incorporadas durante o build.
- [Chaves do Firebase](https://firebase.google.com/docs/projects/api-keys): a
  configuração web identifica o projeto; autorização dos dados depende das regras.
