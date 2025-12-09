import React from 'react';
import './paginacao.css';

const Paginacao = ({ page = 0, totalPages = 1, onPageChange }) => {
    if (!onPageChange || totalPages <= 0) {
        return null;
    }

    const handlePrev = () => {
        if (page > 0) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages - 1) {
            onPageChange(page + 1);
        }
    };

    const renderPageButtons = () => {
        const buttons = [];
        const maxButtons = 5;
        
        let startPage = Math.max(0, page - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);
        
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(0, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li key={i}>
                    <button
                        className={i === page ? 'active' : ''}
                        onClick={() => onPageChange(i)}
                        aria-current={i === page ? 'page' : undefined}
                    >
                        {i + 1}
                    </button>
                </li>
            );
        }
        return buttons;
    };

    return (
        <nav aria-label="Paginação de livros">
            <ul className="paginacao">
                <li>
                    <button
                        onClick={handlePrev}
                        disabled={page === 0}
                        aria-label="Página anterior"
                    >
                        <i className="bx bx-chevron-left"></i>
                    </button>
                </li>
                {renderPageButtons()}
                <li>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages - 1}
                        aria-label="Próxima página"
                    >
                        <i className="bx bx-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Paginacao;
