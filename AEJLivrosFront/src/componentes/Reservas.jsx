import React, { useState, useEffect } from 'react';
import './reservas.css';
import { listarReservasUsuario, cancelarReserva } from '../services/api';
import { authService } from '../services/authService';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarReservas();
    }, []);

    const carregarReservas = async () => {
        try {
            setLoading(true);

            const userId = authService.getUserId();
            if (!userId) {
                setError("Usuário não autenticado");
                return;
            }

            const response = await listarReservasUsuario(userId);
            setReservas(response.data || []);
        } catch (erro) {
            console.error("Erro ao carregar reservas:", erro);
            setError("Erro ao carregar reservas");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarReserva = async (id) => {
        const ok = window.confirm("Deseja realmente cancelar esta reserva?");
        if (!ok) return;

        try {
            await cancelarReserva(id);
            alert("Reserva cancelada com sucesso!");
            carregarReservas();
        } catch{
            alert("Erro ao cancelar a reserva.");
        }
    };

    const handleVerReserva = (reserva) => {
        alert(`Abrindo detalhes da reserva: ${reserva.id}`);
    };

    if (loading) return <div className="reservaCont"><p>Carregando reservas...</p></div>;
    if (error) return <div className="reservaCont"><p style={{ color: "red" }}>{error}</p></div>;

    return (
        <div className="reservaCont">

            {reservas.length === 0 ? (
                <p>Nenhuma reserva encontrada.</p>
            ) : (
                reservas.map((reserva) => (
                    <div 
                        key={reserva.id}
                        className={`reservaCard ${reserva.statusReserva === "Cancelada" ? "reserva-cancelada" : ""}`}
                    >
                        
                        <div className="reservaThumb">
                            {reserva.livro?.imagem ? (
                                <img src={reserva.livro.imagem} alt={reserva.livro.titulo} />
                            ) : (
                                <div className="thumb-mock"><i className='bx bx-image'></i></div>
                            )}
                        </div>

                        <div className="reservaInfo">
                            <h3>{reserva.livro?.titulo || "Livro desconhecido"}</h3>

                            <p className="reservaDates">
                                Reserva feita em: {new Date(reserva.dtReserva).toLocaleDateString("pt-BR")}
                            </p>

                            <p className="reservaDates">
                                Data limite: {new Date(reserva.dtLimite).toLocaleDateString("pt-BR")}
                            </p>

                            <div className="reservaActions">
                                <span className="reservaPrice">R$ {reserva.totalReserva}</span>

                                <div className="reservaButtons">
                                    {reserva.statusReserva !== "Cancelada" && (
                                        <>
                                            <button 
                                                className="btn-outline" 
                                                onClick={() => handleCancelarReserva(reserva.id)}
                                            >
                                                Cancelar Reserva
                                            </button>

                                            <button 
                                                className="btn-primary" 
                                                onClick={() => handleVerReserva(reserva)}
                                            >
                                                Ver Reserva
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {reserva.statusReserva === "Cancelada" && (
                            <div className="reservaStatus">Reserva Cancelada</div>
                        )}

                    </div>
                ))
            )}

        </div>
    );
};

export default Reservas;
