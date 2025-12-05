import { useState, useEffect } from 'react';
import api from '../services/api';

export function useLivrosGlobal() {
    const [livrosGlobal, setLivrosGlobal] = useState([]);
    const [loading, setLoading] = useState(true);

    // termo padrão para evitar erro 500 do backend
    const FALLBACK_TERM = "a";

    useEffect(() => {
        const carregarTodosLivros = async () => {
            try {
                setLoading(true);

                const response = await api.get('/livros/buscar', {
                    params: { 
                        q: FALLBACK_TERM,
                        page: 0,
                        size: 1000 
                    }
                });

                const livros = response.data.livros || [];

                setLivrosGlobal(
                    livros.map(l => ({
                        id: l.id,
                        titulo: l.titulo,
                        autor: l.autor,
                        capa: l.capa,
                        categoria: l.categoria,
                        descricao: l.descricao,
                        editora: l.editora
                    }))
                );

            } catch (error) {
                console.error('Erro ao carregar livros globais:', error);
                setLivrosGlobal([]);
            } finally {
                setLoading(false);
            }
        };

        carregarTodosLivros();
    }, []);

    /**
     * 🔥 Busca real usando o backend (NÃO local)
     **/
    const buscarLivrosLocal = async (query) => {
        try {
            const termo = query.trim() === '' ? FALLBACK_TERM : query;

            const response = await api.get('/livros/buscar', {
                params: {
                    q: termo,
                    page: 0,
                    size: 20
                }
            });

            const livros = response.data.livros || [];

            return livros.map(l => ({
                id: l.id,
                titulo: l.titulo,
                autor: l.autor,
                capa: l.capa,
                categoria: l.categoria,
                descricao: l.descricao,
                editora: l.editora
            }));

        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }
    };

    return { livrosGlobal, buscarLivrosLocal, loading };
}
