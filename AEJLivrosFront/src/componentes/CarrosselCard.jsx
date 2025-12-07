import React, { useState, useMemo, useEffect, useRef } from "react";
import '../StyleAej.css';
import { useFetchBooks } from "../hooks/useFetchBooks";
import BoxBook from "./BoxBook";

const BOOKS_PER_PAGE = 3;
const ANIMATION_DURATION = 300;

export default function CarrosselCard({ onBookClick }) {
    const { books, isLoading, error } = useFetchBooks(0, 9);
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationTimeoutRef = useRef(null);

    const totalPages = useMemo(() => 
        Math.ceil(books.length / BOOKS_PER_PAGE), 
        [books.length]
    );

    const currentBooks = useMemo(() => {
        const startIndex = currentPage * BOOKS_PER_PAGE;
        const endIndex = startIndex + BOOKS_PER_PAGE;
        return books.slice(startIndex, endIndex);
    }, [books, currentPage]);

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []);

    const handleNext = () => {
        if (isLastPage || isAnimating) return;
        setIsAnimating(true);
        animationTimeoutRef.current = setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setIsAnimating(false);
            animationTimeoutRef.current = null;
        }, ANIMATION_DURATION);
    };

    const handlePrevious = () => {
        if (isFirstPage || isAnimating) return;
        setIsAnimating(true);
        animationTimeoutRef.current = setTimeout(() => {
            setCurrentPage((prev) => prev - 1);
            setIsAnimating(false);
            animationTimeoutRef.current = null;
        }, ANIMATION_DURATION);
    };

    if (isLoading) {
        return (
            <div className="carrossel-loading">
                <p>Carregando livros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="carrossel-error">
                <p>{error}</p>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="carrossel-empty">
                <p>Nenhum livro disponível</p>
            </div>
        );
    }

    return (
        <div className="carrossel-container">
            <div className={`carrossel-books ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {currentBooks.map((book) => (
                    <div key={book.id} className="carrossel-card">
                        <BoxBook
                            imagem={book.imagem}
                            titulo={book.titulo}
                            autor={book.autor}
                            onVer={() => onBookClick && onBookClick(book)}
                        />
                    </div>
                ))}
            </div>
            <div className="carrossel-controls">
                <button 
                    onClick={handlePrevious}
                    className={`carrossel-btn carrossel-btn-prev ${isFirstPage ? 'disabled' : ''}`}
                    disabled={isFirstPage}
                    aria-label="Anterior"
                >
                    <i className='bx bx-left-arrow-alt'></i>
                </button>
                <button 
                    onClick={handleNext}
                    className={`carrossel-btn carrossel-btn-next ${isLastPage ? 'disabled' : ''}`}
                    disabled={isLastPage}
                    aria-label="Próximo"
                >
                    <i className='bx bx-right-arrow-alt'></i>
                </button>
            </div>
        </div>
    );
}
