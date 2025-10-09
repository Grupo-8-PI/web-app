import React, { useState } from 'react';
import './reservas.css';

const Reservas = () => {
    const [reserva, setReserva] = useState({
        id: 1,
        titulo: 'Fúria Vermelha - Trilogia Red Rising Volume #1',
        dataReserva: '05/06/2025',
        dataLimite: '08/06/2025',
        preco: '25,00',
        imagem: '',
        status: 'normal'
    });

    function handleVerReserva(reserva) {
        if (reserva.status === 'cancelada') {
            // validação: não abre detalhes, apenas informa
            alert('Esta reserva foi cancelada.');
            return;
        }
        // aqui você pode abrir um modal ou redirecionar para os detalhes
        alert(`Abrindo detalhes da reserva: ${reserva.titulo}`);
    }

    function handleCancelarReserva() {
        const ok = window.confirm('Deseja realmente cancelar esta reserva?');
        if (!ok) return;
        setReserva(prev => ({ ...prev, status: 'cancelada' }));
    }

    return (
        <div className="reservaCont">
            <div className={`reservaCard ${reserva.status === 'cancelada' ? 'reserva-cancelada' : ''}`}>
                <div className="reservaThumb">
                    {reserva.imagem ? (
                        <img src={reserva.imagem} alt={reserva.titulo} />
                    ) : (
                        <div className="thumb-mock"><i className='bx bx-image'></i></div>
                    )}
                </div>
                <div className="reservaInfo">
                    <h3>{reserva.titulo}</h3>
                    <p className="reservaDates">Reserva feita em: {reserva.dataReserva}</p>
                    <p className="reservaDates">Data limite para retirada: {reserva.dataLimite}</p>
                    <div className="reservaActions">
                        <span className="reservaPrice">R$ {reserva.preco}</span>
                        <div className="reservaButtons">
                            {reserva.status !== 'cancelada' && (
                                <>
                                    <button className="btn-outline" onClick={handleCancelarReserva}>Cancelar Reserva</button>
                                    <button className="btn-primary" onClick={() => handleVerReserva(reserva)}>Ver Reserva</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {reserva.status === 'cancelada' && <div className="reservaStatus">Reserva Cancelada</div>}
            </div>
        </div>
    );
};

export default Reservas;