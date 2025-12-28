import type { Product } from '../types'

const kidsData: Product[] = [
  {
    id: 1,
    title: 'Bíblia Alvorecer Kids',
    price: 89.90,
    category: 'Livros',
    ageRange: '3-5',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    badge: 'Mais Vendido',
    description: 'A Palavra de Deus adaptada para os pequenos, com ilustrações vibrantes que encantam e ensinam.',
  },
  {
    id: 2,
    title: 'Leãozinho da Tribo (Pelúcia)',
    price: 129.90,
    category: 'Brincar & Aprender',
    ageRange: '0-2',
    image: 'https://images.pexels.com/photos/1013759/pexels-photo-1013759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    badge: 'Exclusivo',
    description: 'Pelúcia antialérgica do mascote do Alvorecer Kids. Perfeito para abraçar na hora de dormir.',
  },
  {
    id: 3,
    title: 'Devocional Pequenos Guerreiros',
    price: 49.90,
    category: 'Livros',
    ageRange: '6-8',
    image: 'https://images.pexels.com/photos/2035252/pexels-photo-2035252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: '365 dias de aventuras bíblicas para fortalecer a fé dos seus filhos.',
  },
  {
    id: 4,
    title: 'Kit Aventureiros da Fé',
    price: 159.90,
    category: 'Brincar & Aprender',
    ageRange: '6-8',
    image: 'https://images.pexels.com/photos/3662803/pexels-photo-3662803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    badge: 'Promoção',
    description: 'Mochila, garrafinha e caderno de atividades para a escola bíblica.',
  },
  {
    id: 5,
    title: 'Camiseta Soldadinho (Dourada)',
    price: 59.90,
    category: 'Decoração', // Temporário já que Roupas não existe no type
    ageRange: '3-5',
    image: 'https://images.pixabay.com/photo/2016/11/29/01/34/mannequin-1866571_1280.jpg',
    description: 'Esta categoria será atualizada para Vestuário em breve. Camiseta 100% algodão.',
    badge: 'Novo'
  },
  {
    id: 6,
    title: 'Luminária Arca de Noé',
    price: 119.90,
    category: 'Decoração',
    ageRange: '0-2',
    image: 'https://images.pexels.com/photos/57996/night-light-lighting-sleep-57996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Luz noturna suave para o quarto do bebê, com formato da arca.',
  },
]

export default kidsData
