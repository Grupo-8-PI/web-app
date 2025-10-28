import React from 'react';
import './paginacao.css';

const Paginacao = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null; // não mostra paginação se tiver 1 página

    const handlePrev = () => {
        if (page > 0) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages - 1) onPageChange(page + 1);
    };

    const renderPageButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
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
        <nav>
            <ul className="paginacao">
                <li>
                    <button onClick={handlePrev} disabled={page === 0} aria-label="Página anterior">
                        <i className="bx bx-chevron-left"></i>
                    </button>
                </li>
                {renderPageButtons()}
                <li>
                    <button onClick={handleNext} disabled={page === totalPages - 1} aria-label="Próxima página">
                        <i className="bx bx-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Paginacao;
