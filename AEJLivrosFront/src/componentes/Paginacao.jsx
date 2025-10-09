import React from 'react';
import './paginacao.css';

const Paginacao = () => {
    return (
        <nav>
            {/* Conteúdo da paginação aqui */}
            <ul className="paginacao">
                <li><button aria-label="Página anterior"><i className="bx bx-chevron-left"></i></button></li>
                <li><button aria-current="page">1</button></li>
                <li><button>2</button></li>
                <li><button>3</button></li>
                <li><button aria-label="Próxima página"><i className="bx bx-chevron-right"></i></button></li>
            </ul>
        </nav>
    );
};

export default Paginacao;