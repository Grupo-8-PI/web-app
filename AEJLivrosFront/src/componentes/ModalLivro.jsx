import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './modalLivro.css';
import { Header } from './Header';
import { criarReserva } from '../services/api';

const ModalLivro = ({ livro, onClose }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!livro) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [livro]);

    const handleReservarLivro = async () => {
        setLoading(true);
        try {
            const dtReserva = new Date().toISOString();

            const dtLimite = new Date();
            dtLimite.setDate(dtLimite.getDate() + 14);
            const dtLimiteFormatada = dtLimite.toISOString();

            const payload = {
                dtReserva: dtReserva,
                dtLimite: dtLimiteFormatada,
                statusReserva: "Confirmada",
                totalReserva: livro.preco || 150,
                livroId: livro.id,
            };

            console.log("Enviando payload:", payload);

            await criarReserva(payload);

            alert('Reserva criada com sucesso!');
            onClose();
        } catch (erro) {
            console.error('Erro ao criar reserva:', erro);
            alert('Erro ao criar reserva. Verifique os dados ou tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!livro) return null;

    const modalContent = (
        <div className="modalLivro-overlay" onClick={onClose}>
            <div className="modalLivro" onClick={e => e.stopPropagation()}>
                <div className="headerSpace">
                    <Header />
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
                        <p><b>Editora:</b> {livro.editora || 'Desconhecida'}</p>
                        <p><b>Páginas:</b> {livro.paginas || 'N/A'}</p>
                        <p><b>Sinopse com IA:</b> {livro.descricao || 'Descrição não disponível.'}</p>

                    <div className="buttonsArea">
                        <button>Reservar Livro</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ModalLivro;
