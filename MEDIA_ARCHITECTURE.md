# Mídia: Firebase + Cloudflare

## Responsabilidades

| Serviço | Uso |
| --- | --- |
| Firebase Authentication | Login e identidade do usuário |
| Cloud Firestore | Produtos, perfis, pedidos e demais dados da aplicação |
| Cloudflare R2 | Imagens públicas de produtos, cursos e conteúdo |
| Cloudflare Worker | Futuro upload privado de perfil e operações de servidor |

## Etapa atual

O frontend não usa Firebase Storage. O campo `image` de cada produto deve
conter a URL pública da imagem no R2, por exemplo:

```text
https://media.seudominio.com/produtos/caminhada-com-cristo.webp
```

O bucket do projeto é `alvorecermentorias-media`. Durante o desenvolvimento,
ele está disponível em `https://pub-845ec24fd24241a09ec52e2e97c81366.r2.dev`.

## Configuração inicial do R2

1. Use o bucket Standard `alvorecermentorias-media`.
2. Quando houver um domínio adequado, conecte-o, por exemplo
   `media.seudominio.com`.
3. Publique apenas mídias de catálogo nessa URL pública.
4. Organize os arquivos em `produtos/`, `cursos/` e `conteudos/`.
5. Defina `VITE_PUBLIC_MEDIA_BASE_URL` no `.env.local` quando o domínio existir.

## Privacidade

Fotos de perfil e arquivos de clientes não devem usar o domínio público.
Numa próxima etapa, um Cloudflare Worker validará o usuário autenticado antes
de gerar URLs de upload ou leitura para uma área privada do R2.

## Operação

O R2 tem franquia mensal, não garantia de custo zero ilimitado. Acompanhe
armazenamento, leituras e gravações no painel da Cloudflare antes de escalar.
