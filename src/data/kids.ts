import type { Product } from '../types'

const kids: Product[] = [
  { id: 1, title: 'Bíblia Ilustrada para Pequenos', image: '/images/kids1.jpg', price: 79.9, ageRange: '3-5', category: 'Livros', badge: 'Novo' },
  { id: 2, title: 'Livro de Atividades — Histórias da Bíblia', image: '/images/kids2.jpg', price: 49.9, ageRange: '6-8', category: 'Livros' },
  { id: 3, title: 'Quebra-cabeça Arca de Noé', image: '/images/kids3.jpg', price: 59.9, ageRange: '3-5', category: 'Brincar & Aprender' },
  { id: 4, title: 'Canções para Dormir — Vol. 1', image: '/images/kids4.jpg', price: 29.9, ageRange: '0-2', category: 'Louvor', badge: 'Mais vendido' },
  { id: 5, title: 'Quadro Decorativo Anjinhos', image: '/images/kids5.jpg', price: 39.9, ageRange: '6-8', category: 'Decoração' },
  { id: 6, title: 'Kit Colorir — Personagens Bíblicos', image: '/images/kids6.jpg', price: 34.9, ageRange: '6-8', category: 'Brincar & Aprender' },
  { id: 7, title: 'Sticker Pack — Heróis da Fé', image: '/images/kids7.jpg', price: 19.9, ageRange: '9-12', category: 'Decoração' },
  { id: 8, title: 'Hinário Infantil (Digital)', image: '/images/kids8.jpg', price: 24.9, ageRange: '9-12', category: 'Louvor' },
]

export default kids

// =============================
// (Opcional) db.json — exemplo de seção "kids" para usar com json-server
// Coloque este bloco dentro do seu db.json existente e rode: json-server --watch db.json --port 5174
// =============================
/*
{
  "kids": [
    { "id": 1, "title": "Bíblia Ilustrada para Pequenos", "image": "/images/kids1.jpg", "price": 79.9, "ageRange": "3-5", "category": "Livros", "badge": "Novo" },
    { "id": 2, "title": "Livro de Atividades — Histórias da Bíblia", "image": "/images/kids2.jpg", "price": 49.9, "ageRange": "6-8", "category": "Livros" },
    { "id": 3, "title": "Quebra-cabeça Arca de Noé", "image": "/images/kids3.jpg", "price": 59.9, "ageRange": "3-5", "category": "Brincar & Aprender" },
    { "id": 4, "title": "Canções para Dormir — Vol. 1", "image": "/images/kids4.jpg", "price": 29.9, "ageRange": "0-2", "category": "Louvor", "badge": "Mais vendido" },
    { "id": 5, "title": "Quadro Decorativo Anjinhos", "image": "/images/kids5.jpg", "price": 39.9, "ageRange": "6-8", "category": "Decoração" },
    { "id": 6, "title": "Kit Colorir — Personagens Bíblicos", "image": "/images/kids6.jpg", "price": 34.9, "ageRange": "6-8", "category": "Brincar & Aprender" },
    { "id": 7, "title": "Sticker Pack — Heróis da Fé", "image": "/images/kids7.jpg", "price": 19.9, "ageRange": "9-12", "category": "Decoração" },
    { "id": 8, "title": "Hinário Infantil (Digital)", "image": "/images/kids8.jpg", "price": 24.9, "ageRange": "9-12", "category": "Louvor" }
  ]
}
*/

// =============================
// Observações
// - Adicione imagens de placeholder na pasta public/images (kids1.jpg, course1.jpg, etc.)
// - Se quiser trocar o mock local pela API fake do json-server, em `Kids.tsx` basta trocar o import do `kidsData` por um fetch em useEffect.
// - O design segue uma estética limpa, moderna e responsiva (mobile-first) com Tailwind.
