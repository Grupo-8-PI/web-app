import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './modalLivro.css';
import { criarReserva, buscarLivroPorId } from '../services/api';
import livroService from '../services/livroService';
import { formatDateTimeBR } from '../utils/dateUtils';
import { STATUS } from '../utils/statusUtils';

const ModalLivro = ({ livro, onClose, onReservaSucesso }) => {
    const [loading, setLoading] = useState(false);
    const [erroReserva, setErroReserva] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!livro?.id) return;

        buscarLivroPorId(livro.id).then(resp => {
            if (resp?.data?.hasReserva !== undefined) {
                livro.hasReserva = resp.data.hasReserva;
            }
        }).catch(console.error);

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [livro?.id]);

    const handleReservarLivro = async () => {
        setErroReserva("");

        if (livro.hasReserva) {
            setErroReserva("Este livro já está reservado e não pode ser reservado novamente.");
            return;
        }

        setLoading(true);
        try {
            const response = await criarReserva({
                livroId: livro.id,
                statusReserva: STATUS.CONFIRMADA
            });

            const dtLimiteFormatted = formatDateTimeBR(response.data.dtLimite);
            alert(
                `Reserva confirmada!\n` +
                `Válida até: ${dtLimiteFormatted}\n` +
                `Valor: R$ ${response.data.totalReserva}`
            );

            await livroService.listarLivros(0, 9, { bypassCache: true });
            navigate('/catalogo', { state: { vindoDeReserva: true } });

            onClose();
            if (onReservaSucesso) {
                onReservaSucesso(0, undefined, true);
            }
        } catch (erro) {
            const errorMsg = erro.response?.data?.message || 
                           'Erro ao criar reserva. Verifique os dados ou tente novamente.';
            setErroReserva(errorMsg);
            console.error('Erro ao criar reserva:', erro);
        } finally {
            setLoading(false);
        }
    };

    if (!livro) return null;

    const { imagem, titulo, preco, autor, ano, categoria, conservacao, editora, paginas, descricao } = livro;

    return ReactDOM.createPortal(
        <div className="modalLivro-overlay" onClick={onClose}>
            <div className="modalLivro" onClick={e => e.stopPropagation()}>
                <button className="modalLivro-close" onClick={onClose}>×</button>

                <div className="modalLivro-content">
                    <div className="modalLivro-img">
                        {imagem ? (
                            <img src={imagem} alt={titulo} />
                        ) : (
                            <div className="mock-imagem"><i className='bx bx-image'></i></div>
                        )}
                    </div>

                    <div className="modalLivro-info">
                        <h2>{titulo}</h2>
                        <h3>R$ {preco?.toFixed(2) || '0.00'}</h3>
                        <p><b>Autor:</b> {autor || 'Desconhecido'}</p>
                        <p><b>Ano:</b> {ano || 'N/A'}</p>
                        <p><b>Categoria:</b> {categoria || 'Não informada'}</p>
                        <p><b>Conservação:</b> {conservacao || 'Não informada'}</p>
                        <p><b>Editora:</b> {editora || 'Desconhecida'}</p>
                        <p><b>Páginas:</b> {paginas || 'N/A'}</p>
                        <p><b>Sinopse:</b> {descricao || 'Descrição não disponível.'}</p>

                        <div className="buttonsArea">
                            <button
                                onClick={handleReservarLivro}
                                disabled={loading || livro.hasReserva}
                            >
                                {livro.hasReserva
                                    ? 'Livro já reservado'
                                    : loading
                                        ? 'Reservando...'
                                        : 'Reservar Livro'}
                            </button>
                        </div>

                        {erroReserva && (
                            <div style={{ color: 'red', marginTop: 8 }}>
                                {erroReserva}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModalLivro;
