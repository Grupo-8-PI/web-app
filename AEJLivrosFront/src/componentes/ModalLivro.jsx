import React from 'react';
import './modalLivro.css';

const ModalLivro = ({ livro, onClose }) => {
    if (!livro) return null;
    return (
        <div className="modalLivro-overlay" onClick={onClose}>
            <div className="modalLivro" onClick={e => e.stopPropagation()}>
                <button className="modalLivro-close" onClick={onClose}>×</button>
                <div className="modalLivro-content">
                    <div className="modalLivro-img">
                        {livro.imagem ? (
                            <img src={livro.imagem} alt={livro.titulo} />
                        ) : (
                            <div className="mock-imagem"><i className='bx bx-image'></i></div>
                        )}
                    </div>
                    <div className="modalLivro-info">
                        <h2>{livro.titulo}</h2>
                        <h3>R$ {livro.preco}</h3>
                        <p><b>Autor:</b> {livro.autor}</p>
                        <p><b>Ano:</b> {livro.ano}</p>
                        <p><b>Categoria:</b> {livro.categoria}</p>
                        <p><b>Conservação:</b> {livro.conservacao}</p>
                        {/* Campos extras */}
                        <p><b>Editora:</b> {livro.editora || 'Desconhecida'}</p>
                        <p><b>Páginas:</b> {livro.paginas || 'N/A'}</p>
                        <p><b>Sinopse com IA:</b> {livro.descricao || 'Descrição não disponível.'}</p>
                    <div className="buttonsArea">
                        <button>Reservar Livro</button>
                        <button>Gerar Sinopse com IA</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalLivro;