# Auditoria do catálogo do Firestore

Atualizado em: 14 de julho de 2026

Projeto Firebase: `alvorecermentorias`

Coleção: `products`

## Resumo

A auditoria foi executada somente em modo de leitura. Nenhum documento foi
alterado ou excluído.

- 24 documentos encontrados;
- 11 documentos marcados como `store`;
- 13 documentos marcados como `kids`;
- 11 pares de produtos duplicados;
- 1 produto com conflito entre as seções `store` e `kids`;
- 3 produtos com imagem externa indisponível, considerando apenas os registros
  que serão mantidos;
- 0 produto sem os campos mínimos exigidos pelo catálogo.

Após a limpeza proposta, o catálogo terá 12 produtos: 6 em `store` e 6 em
`kids`.

## Plano de limpeza

A seleção preserva o documento mais recente de cada par. A execução só deve
acontecer depois de uma confirmação explícita do proprietário e deve gerar um
backup JSON dos documentos antes da exclusão.

| Produto | Manter | Remover | Motivo |
|---|---|---|---|
| Bíblia Alvorecer Kids | `5OU6bdWe6P51m0ydY22m` | `uUa9ofp6qSGkQgjTtPW4` | Duplicado mais antigo |
| Oração que Transforma | `7jShj3rkmQ3n5LdykVmB` | `UodDnxCdB8AzUqMk77OG` | Duplicado mais antigo |
| Kit Aventureiros da Fé | `AtdfWYfwRY6Wh1al1kxz` | `hDTmkcwcQDr7PPA44Y20` | Duplicado mais antigo |
| Leãozinho | `yoCxzRqmupjOZxECMFIH` | `GILaYMvmubuGLpC3R0xc` | Duplicado mais antigo |
| Fundamentos | `GawHJl4XcKyzDv9kDNQm` | `orkDT4ilbVzBX01uUPJG` | Duplicado mais antigo |
| Caminhada com Cristo | `IuiD7jSU8oHoo0f9wSt1` | `RplLj9FPo9pznCCEWWJK` | Duplicado mais antigo |
| Camiseta | `Q03Vy2cTtg2TNPmzXIb2` | `pxSxgKMfxccaktuDkGmB` | Duplicado mais antigo |
| Devocional Pequenos | `ULLgTusdwez4xP6Taz8D` | `QrHOPxgcTrpYEVSDxE01` | Duplicado mais antigo |
| Liderança | `RPDGTcH1Uz9VIPIzGRwF` | `wR7O5n2AXpDAYun9JFVj` | Duplicado mais antigo |
| Devocional Completo | `XKpNbLor8VHKHVOtatAo` | `wKwbKtGHup4tHQSvwaVn` | Duplicado mais antigo |
| Luminária | `ysIpPJMxobvNj0NAOusa` | `jll4hmWR7fZqSzNgu18w` | Duplicado mais antigo |
| Educação de Filhos | `1hqIbwMGFQln41pyirue` | `0kReEP6dJtwX6GF90e1a` | Registro indevido em `kids`; preservar `store` |

## Imagens pendentes

Os produtos abaixo apontam para imagens externas que não responderam à
verificação. O frontend agora apresenta a marca Alvorecer como fallback, mas a
solução definitiva é enviar imagens próprias ao bucket R2 e atualizar os campos
`image` correspondentes.

| Produto | Documento a manter | Situação atual |
|---|---|---|
| Leãozinho | `yoCxzRqmupjOZxECMFIH` | URL do Pexels retorna 404 |
| Camiseta | `Q03Vy2cTtg2TNPmzXIb2` | URL do Pixabay indisponível na auditoria |
| Luminária | `ysIpPJMxobvNj0NAOusa` | URL do Pexels retorna 404 |

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
