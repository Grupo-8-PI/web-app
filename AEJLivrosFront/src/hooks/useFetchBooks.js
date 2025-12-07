import { useState, useEffect, useCallback } from 'react';
import livroService from '../services/livroService';

export const useFetchBooks = (page = 0, size = 9) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await livroService.listarLivros(page, size);
            
            const bookArray = response.livros || response.content || response || [];
            
            const normalizedBooks = bookArray.map(book => ({
                id: book.id,
                titulo: book.titulo,
                autor: book.autor,
                imagem: book.capa || book.imagem || null,
                preco: book.preco,
                ano: book.anoPublicacao || book.ano,
                categoria: book.nomeCategoria || book.categoria || null,
                conservacao: book.estadoConservacao || book.conservacao || null,
                editora: book.editora,
                paginas: book.paginas,
                descricao: book.descricao || null
            }));

            setBooks(normalizedBooks);
        } catch (err) {
            console.error('Erro ao buscar livros:', err);
            setError('Não foi possível carregar os livros');
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return { books, isLoading, error, refetch: fetchBooks };
};
