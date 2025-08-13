```ts
// src/types/index.ts
export type Product = {
  id: number
  title: string
  image: string
  price: number
  ageRange: '0-2' | '3-5' | '6-8' | '9-12'
  category: 'Livros' | 'Brincar & Aprender' | 'Louvor' | 'Decoração'
  badge?: string
}
```