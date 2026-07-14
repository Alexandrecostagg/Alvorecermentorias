import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, firebaseConfigurationMessage, isFirebaseConfigured } from '../lib/firebase';
import type { Product } from '../types';
import { getErrorMessage } from '../lib/errors';

interface UseProductsOptions {
    section?: 'store' | 'kids';
    featured?: boolean;
}

export function useProducts({ section, featured }: UseProductsOptions = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setProducts([]);
            setError(firebaseConfigurationMessage);
            setLoading(false);
            return;
        }

        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);
                const productsRef = collection(db, 'products');

                // Construir query inicial
                // Nota: Firestore requer índexes para queries compostas complexas.
                // Por simplicidade, faremos filtro básico e refinamento no cliente se necessário,
                // mas aqui vamos tentar usar constraints simples.

                let q = query(productsRef); // Pega tudo por padrão

                if (section) {
                    q = query(q, where('section', '==', section));
                }

                // Nota: O filtro 'featured' pode precisar ser aplicado no cliente se colidir com orderBy/cláusulas
                // Vamos aplicar no cliente para evitar erros de índice agora.

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id, // ID string do Firestore
                    ...doc.data()
                })) as unknown as Product[]; // Cast para Product (ajustaremos o tipo se precisar)

                // Filtro client-side para featured se fornecido
                const filtered = featured
                    ? data.filter(p => p.featured === true)
                    : data;

                setProducts(filtered);
            } catch (err: unknown) {
                console.error("Error fetching products:", err);
                setError(getErrorMessage(err, 'Erro ao carregar produtos'));
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [section, featured]);

    return { products, loading, error };
}
