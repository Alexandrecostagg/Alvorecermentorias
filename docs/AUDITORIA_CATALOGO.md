# Auditoria do catálogo do Firestore

Atualizado em: 14 de julho de 2026

Projeto Firebase: `alvorecermentorias`

Coleção: `products`

## Resumo

A auditoria inicial encontrou 24 documentos, 11 pares duplicados e 1 conflito
entre as seções `store` e `kids`. Após aprovação do proprietário, a limpeza foi
executada em 14 de julho de 2026.

Estado final confirmado por nova auditoria:

- 12 documentos;
- 6 documentos marcados como `store`;
- 6 documentos marcados como `kids`;
- 0 grupo duplicado;
- 0 conflito de seção;
- 0 produto sem os campos mínimos exigidos pelo catálogo;
- 3 produtos com imagem externa indisponível.

Antes da exclusão, os 12 documentos foram validados por ID, título e seção e
salvos no backup local ignorado pelo Git
`backups/catalog-cleanup-2026-07-14T15-15-18-053Z.json`.

## Limpeza executada

A seleção preservou o documento mais recente de cada par. Os documentos abaixo
foram excluídos somente depois da confirmação explícita e da criação do backup.

| Produto | Manter | Remover | Motivo |
|---|---|---|---|
| Bíblia Alvorecer Kids | `5OU6bdWe6P51m0ydY22m` | `uUa9ofp6qSGkQgjTtPW4` | Duplicado mais antigo |
| Oração que Transforma | `7jShj3rkmQ3n5LdykVmB` | `UodDnxCdB8AzUqMk77OG` | Duplicado mais antigo |
| Kit Aventureiros da Fé | `AtdfWYfwRY6Wh1al1kxz` | `hDTmkcwcQDr7PPA44Y20` | Duplicado mais antigo |
| Leãozinho da Tribo (Pelúcia) | `yoCxzRqmupjOZxECMFIH` | `GILaYMvmubuGLpC3R0xc` | Duplicado mais antigo |
| Fundamentos da Fé | `GawHJl4XcKyzDv9kDNQm` | `orkDT4ilbVzBX01uUPJG` | Duplicado mais antigo |
| Caminhada com Cristo | `IuiD7jSU8oHoo0f9wSt1` | `RplLj9FPo9pznCCEWWJK` | Duplicado mais antigo |
| Camiseta Soldadinho (Dourada) | `Q03Vy2cTtg2TNPmzXIb2` | `pxSxgKMfxccaktuDkGmB` | Duplicado mais antigo |
| Devocional Pequenos Guerreiros | `ULLgTusdwez4xP6Taz8D` | `QrHOPxgcTrpYEVSDxE01` | Duplicado mais antigo |
| Liderança Cristã | `RPDGTcH1Uz9VIPIzGRwF` | `wR7O5n2AXpDAYun9JFVj` | Duplicado mais antigo |
| Devocional Completo 2025 | `XKpNbLor8VHKHVOtatAo` | `wKwbKtGHup4tHQSvwaVn` | Duplicado mais antigo |
| Luminária Arca de Noé | `ysIpPJMxobvNj0NAOusa` | `jll4hmWR7fZqSzNgu18w` | Duplicado mais antigo |
| Educação de Filhos | `1hqIbwMGFQln41pyirue` | `0kReEP6dJtwX6GF90e1a` | Registro indevido em `kids`; preservar `store` |

## Imagens pendentes

Os produtos abaixo apontam para imagens externas que não responderam à
verificação. O frontend agora apresenta a marca Alvorecer como fallback, mas a
solução definitiva é enviar imagens próprias ao bucket R2 e atualizar os campos
`image` correspondentes.

| Produto | Documento a manter | Situação atual |
|---|---|---|
| Leãozinho da Tribo (Pelúcia) | `yoCxzRqmupjOZxECMFIH` | URL do Pexels retorna 404 |
| Camiseta Soldadinho (Dourada) | `Q03Vy2cTtg2TNPmzXIb2` | URL do Pixabay indisponível na auditoria |
| Luminária Arca de Noé | `ysIpPJMxobvNj0NAOusa` | URL do Pexels retorna 404 |

## Correção estrutural aplicada

Alguns documentos possuem um campo legado `id` numérico. Esse campo
sobrescrevia o identificador real do Firestore durante a montagem do produto no
frontend. Como consequência, carrinho e checkout podiam usar uma identificação
que o Worker não conseguiria consultar.

O frontend agora sempre utiliza `document.id` como identidade do produto. O
campo legado continua preservado no banco apenas para compatibilidade, mas não
controla mais carrinho, pedidos ou checkout.

## Como repetir a auditoria

Com as variáveis públicas do Firebase configuradas em `.env.local`:

```bash
npm run audit:catalog
```

O comando é somente leitura e informa duplicidades, conflitos de seção,
campos incompletos e imagens inacessíveis.
