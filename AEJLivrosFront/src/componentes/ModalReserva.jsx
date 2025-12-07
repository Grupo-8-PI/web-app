import React from 'react';
import ReactDOM from 'react-dom';
import './ModalReserva.css';
import { formatDateTimeBR, formatRemainingDays } from '../utils/dateUtils';

const ModalReserva = ({ reserva, onClose }) => {
    if (!reserva) return null;

    const getStatusClass = () => {
        if (reserva.statusReserva === 'Cancelada') return 'status-cancelada';
        if (reserva.statusReserva === 'Concluída') return 'status-concluida';
        if (reserva.statusReserva === 'Confirmada') return 'status-confirmada';
        return 'status-pendente';
    };

    const modalContent = (
        <div className="modal-reserva-overlay" onClick={onClose}>
            <div className="modal-reserva-content" onClick={e => e.stopPropagation()}>
                <button className="modal-reserva-close" onClick={onClose}>×</button>
                
                <h2 className="modal-reserva-title">Detalhes da Reserva</h2>

                <div className="modal-reserva-body">
                    {reserva.livro && (
                        <div className="modal-reserva-livro">
                            <div className="modal-reserva-capa">
                                {reserva.livro.capa ? (
                                    <img src={reserva.livro.capa} alt={reserva.livro.titulo} />
                                ) : (
                                    <div className="capa-mock">
                                        <i className='bx bx-book'></i>
                                    </div>
                                )}
                            </div>
                            <div className="modal-reserva-livro-info">
                                <h3>{reserva.livro.titulo}</h3>
                                <p><strong>Autor:</strong> {reserva.livro.autor || 'Não informado'}</p>
                                <p><strong>Editora:</strong> {reserva.livro.editora || 'Não informada'}</p>
                                <p><strong>Categoria:</strong> {reserva.livro.nomeCategoria || 'Não informada'}</p>
                            </div>
                        </div>
                    )}

                    <div className="modal-reserva-detalhes">
                        <div className="detalhe-item">
                            <span className="detalhe-label">Código da Reserva:</span>
                            <span className="detalhe-valor">#{reserva.id}</span>
                        </div>

                        <div className="detalhe-item">
                            <span className="detalhe-label">Status:</span>
                            <span className={`detalhe-valor status-badge ${getStatusClass()}`}>
                                {reserva.statusReserva}
                            </span>
                        </div>

                        <div className="detalhe-item">
                            <span className="detalhe-label">Data da Reserva:</span>
                            <span className="detalhe-valor">{formatDateTimeBR(reserva.dtReserva)}</span>
                        </div>

                        <div className="detalhe-item">
                            <span className="detalhe-label">Validade:</span>
                            <span className="detalhe-valor">{formatDateTimeBR(reserva.dtLimite)}</span>
                        </div>

                        <div className="detalhe-item">
                            <span className="detalhe-label">Tempo Restante:</span>
                            <span className="detalhe-valor detalhe-destaque">
                                {formatRemainingDays(reserva.dtLimite)}
                            </span>
                        </div>

                        <div className="detalhe-item detalhe-total">
                            <span className="detalhe-label">Valor Total:</span>
                            <span className="detalhe-valor detalhe-preco">
                                R$ {reserva.totalReserva?.toFixed(2) || '0.00'}
                            </span>
                        </div>
                    </div>

                    <div className="modal-reserva-instrucoes">
                        <h4><i className='bx bx-info-circle'></i> Instruções</h4>
                        <ul>
                            <li>Apresente este código na retirada: <strong>#{reserva.id}</strong></li>
                            <li>A reserva é válida até: <strong>{formatDateTimeBR(reserva.dtLimite)}</strong></li>
                            <li>Após a data limite, a reserva será cancelada automaticamente</li>
                            <li>Lembre-se de trazer um documento com foto</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-reserva-footer">
                    <button className="btn-fechar" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ModalReserva;
