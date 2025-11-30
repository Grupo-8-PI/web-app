import { useState, useEffect } from 'react';
import api from '../services/api';
    
export function useLivrosGlobal() {
    const [livrosGlobal, setLivrosGlobal] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarTodosLivros = async () => {
            try {
                setLoading(true);
                const response = await api.get('/livros', {
                    params: { page: 0, size: 1000 }
                });
                
                console.log('Resposta da API:', response.data);
                
                const data = response.data.livros || response.data.items || response.data.data || [];
                console.log('Dados extraídos:', data);
                
                const mapped = data.map(l => ({
                    id: l.id || l._id,
                    titulo: l.titulo || l.nome || l.title || '',
                    autor: l.autor || l.autores || '',
                    capa: l.capa || l.imagem || l.cover || null,
                }));
                
                console.log('Livros mapeados:', mapped);
                setLivrosGlobal(mapped);
            } catch (error) {
                console.error('Erro ao carregar livros globais:', error);
                setLivrosGlobal([]);
            } finally {
                setLoading(false);
            }
        };

        carregarTodosLivros();
    }, []);

    const buscarLivrosLocal = (query) => {
        if (!query.trim()) return [];
        
        const queryLower = query.toLowerCase();
        const resultados = livrosGlobal.filter(livro => 
            (livro.titulo && livro.titulo.toLowerCase().includes(queryLower)) ||
            (livro.autor && livro.autor.toLowerCase().includes(queryLower))
        );
        
        console.log('Busca local por:', query, '| Resultados:', resultados);
        return resultados;
    };

    return { livrosGlobal, buscarLivrosLocal, loading };
}
