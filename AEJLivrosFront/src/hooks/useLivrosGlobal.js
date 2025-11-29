import { useState, useEffect } from 'react';

const LIVROS_MOCK = [
    {
        id: 1,
        titulo: 'Harry Potter e a Pedra Filosofal',
        autor: 'J.K. Rowling',
        capa: 'https://m.media-amazon.com/images/P/B0192CTMYC.01._SCLZZZZZZZ_SX500_.jpg'
    },
    {
        id: 2,
        titulo: 'Harry Potter e a Câmara Secreta',
        autor: 'J.K. Rowling',
        capa: 'https://m.media-amazon.com/images/P/B0192CTMYC.01._SCLZZZZZZZ_SX500_.jpg'
    },
    {
        id: 3,
        titulo: 'O Senhor dos Anéis',
        autor: 'J.R.R. Tolkien',
        capa: 'https://m.media-amazon.com/images/P/0544003411.01._SCLZZZZZZZ_SX500_.jpg'
    },
    {
        id: 4,
        titulo: '1984',
        autor: 'George Orwell',
        capa: 'https://m.media-amazon.com/images/P/0451524934.01._SCLZZZZZZZ_SX500_.jpg'
    },
    {
        id: 5,
        titulo: 'O Hobbit',
        autor: 'J.R.R. Tolkien',
        capa: 'https://m.media-amazon.com/images/P/0547928226.01._SCLZZZZZZZ_SX500_.jpg'
    },
    {
        id: 6,
        titulo: 'Orgulho e Preconceito',
        autor: 'Jane Austen',
        capa: 'https://m.media-amazon.com/images/P/0141439513.01._SCLZZZZZZZ_SX500_.jpg'
    }
];

export function useLivrosGlobal() {
    const [livrosGlobal, setLivrosGlobal] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarTodosLivros = async () => {
            try {
                setLoading(true);
                
                console.log('Usando dados mockados:', LIVROS_MOCK);
                setLivrosGlobal(LIVROS_MOCK);
                
            } catch (error) {
                console.error('Erro ao carregar livros globais:', error);
                setLivrosGlobal(LIVROS_MOCK);
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
