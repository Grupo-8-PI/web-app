import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './modalLivro.css';
import { criarReserva } from '../services/api';
import { formatDateTimeBR } from '../utils/dateUtils';

const ModalLivro = ({ livro, onClose }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!livro) return;
        console.log('MODAL received livro:', livro);
        console.log('MODAL livro keys:', Object.keys(livro));
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [livro]);

    const handleReservarLivro = async () => {
        setLoading(true);
        try {
            const payload = {
                livroId: livro.id,
                statusReserva: "Confirmada"
            };

            console.log("Enviando payload:", payload);

            const response = await criarReserva(payload);
            
            console.log('Reserva criada:', {
                id: response.data.id,
                dtReserva: response.data.dtReserva,
                dtLimite: response.data.dtLimite,
                totalReserva: response.data.totalReserva
            });

            const dtLimiteFormatted = formatDateTimeBR(response.data.dtLimite);

            alert(`Reserva confirmada!\nVálida até: ${dtLimiteFormatted}\nValor: R$ ${response.data.totalReserva}`);
            onClose();
        } catch (erro) {
            console.error('Erro ao criar reserva:', erro);
            const errorMsg = erro.response?.data?.message || 'Erro ao criar reserva. Verifique os dados ou tente novamente.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!livro) return null;

    const modalContent = (
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
                        <h3>R$ {livro.preco?.toFixed(2) || '0.00'}</h3>
                        <p><b>Autor:</b> {livro.autor || 'Desconhecido'}</p>
                        <p><b>Ano:</b> {livro.ano || 'N/A'}</p>
                        <p><b>Categoria:</b> {livro.categoria || 'Não informada'}</p>
                        <p><b>Conservação:</b> {livro.conservacao || 'Não informada'}</p>
                        <p><b>Acabamento:</b> {livro.tipoAcabamento || livro.acabamento || livro.acabamentoId || 'Não informado'}</p>
                        <p><b>Editora:</b> {livro.editora || 'Desconhecida'}</p>
                        <p><b>Páginas:</b> {livro.paginas || 'N/A'}</p>
                        <p><b>Sinopse:</b> {livro.descricao || 'Descrição não disponível.'}</p>

                        <div className="buttonsArea">
                            <button onClick={handleReservarLivro} disabled={loading}>
                                {loading ? 'Reservando...' : 'Reservar Livro'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ModalLivro;
