import { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import kidsData from '../../data/kids';

// Dados da Store (Copiados manualmente pois estavam hardcoded no componente)
const STORE_PRODUCTS = [
    {
        id: 101, // IDs diferentes para não colidir com Kids
        type: 'Livro',
        title: 'Caminhada com Cristo',
        author: 'Luciano Subirá',
        price: 39.90,
        originalPrice: 59.90,
        image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        rating: 4.9,
        reviews: 847,
        category: 'Vida Cristã',
        featured: true,
        section: 'store'
    },
    {
        id: 102,
        type: 'Curso',
        title: 'Fundamentos da Fé',
        author: 'Escola Orvalho',
        price: 197.00,
        originalPrice: 297.00,
        image: 'https://images.pexels.com/photos/416009/pexels-photo-416009.jpeg?auto=compress&cs=tinysrgb&w=1260',
        rating: 4.8,
        reviews: 592,
        category: 'Teologia',
        featured: false,
        section: 'store'
    },
    {
        id: 103,
        type: 'Mentoria',
        title: 'Liderança Cristã',
        author: 'Alexandre Costa',
        price: 897.00,
        originalPrice: 1297.00,
        image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260',
        rating: 5.0,
        reviews: 89,
        category: 'Liderança',
        featured: true,
        section: 'store'
    },
    {
        id: 104,
        type: 'Livro',
        title: 'Oração que Transforma',
        author: 'Hernandes Dias Lopes',
        price: 29.90,
        originalPrice: 49.90,
        image: 'https://images.pexels.com/photos/1809341/pexels-photo-1809341.jpeg?auto=compress&cs=tinysrgb&w=1260',
        rating: 4.7,
        reviews: 1256,
        category: 'Oração',
        featured: false,
        section: 'store'
    },
    {
        id: 105,
        type: 'Kit',
        title: 'Devocional Completo 2025',
        author: 'Café com Deus Pai',
        price: 89.90,
        originalPrice: 119.90,
        image: 'https://images.pexels.com/photos/1329292/pexels-photo-1329292.jpeg?auto=compress&cs=tinysrgb&w=1260',
        rating: 5.0,
        reviews: 2100,
        category: 'Devocional',
        featured: true,
        section: 'store'
    },
    {
        id: 106,
        type: 'Livro',
        title: 'Educação de Filhos',
        author: 'Cris Poli',
        price: 45.00,
        originalPrice: 0,
        image: 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=1260',
        rating: 4.8,
        reviews: 320,
        category: 'Família',
        featured: false,
        section: 'store'
    }
];

export default function AdminSeeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const seedDatabase = async () => {
        if (!confirm('Isso irá sobrescrever os dados no Firebase. Continuar?')) return;

        setLoading(true);
        setStatus('Iniciando migração...');

        try {
            const batch = writeBatch(db);

            // Helper to get random stock
            const getStock = () => Math.floor(Math.random() * 45) + 5;

            // Migrar Kids
            kidsData.forEach((product) => {
                const ref = doc(collection(db, 'products')); // Auto ID
                batch.set(ref, {
                    ...product,
                    section: 'kids',
                    stock: getStock(),
                    createdAt: new Date()
                });
            });

            // Migrar Store
            STORE_PRODUCTS.forEach((product) => {
                const ref = doc(collection(db, 'products')); // Auto ID
                batch.set(ref, {
                    ...product,
                    stock: getStock(),
                    createdAt: new Date()
                });
            });

            await batch.commit();
            setStatus(`Sucesso! ${kidsData.length + STORE_PRODUCTS.length} produtos adicionados.`);
        } catch (error: any) {
            console.error(error);
            setStatus('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700">
                <h1 className="text-2xl font-bold mb-4">Admin Seeder 🛠️</h1>
                <p className="text-slate-400 mb-8">
                    Use esta ferramenta para popular o banco de dados Firestore com os produtos iniciais (Kids + Loja).
                </p>

                {status && (
                    <div className={`p-4 rounded-lg mb-6 ${status.includes('Erro') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {status}
                    </div>
                )}

                <button
                    onClick={seedDatabase}
                    disabled={loading}
                    className="w-full py-3 bg-alvorecer-gold text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processando...' : 'Popular Banco de Dados'}
                </button>
            </div>
        </div>
    );
}
