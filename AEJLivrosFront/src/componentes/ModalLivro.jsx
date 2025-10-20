import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './modalLivro.css';
import { Header } from './Header';

const ModalLivro = ({ livro, onClose }) => {



    useEffect(() => {
        if (!livro) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [livro]);

    if (!livro) return null;

    const modalContent = (
        <div className="modalLivro-overlay" onClick={onClose}>
            <div className="modalLivro" onClick={e => e.stopPropagation()}>
                <div className="headerSpace">
                <Header/>

                </div>
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

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ModalLivro;