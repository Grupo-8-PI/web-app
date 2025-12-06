import React, { useState, useEffect } from "react";
import reservaService from "../../services/reservaService";
import "./Tabela.css";

const Inconsistencias = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [reservasVencidas, setReservasVencidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservas, setSelectedReservas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    carregarReservasVencidas();
  }, []);

  const carregarReservasVencidas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reservaService.listarReservas(0, 1000);
      
      console.log('Resposta da API (Inconsistências):', response);
      
      let todasReservas = [];
      if (response && Array.isArray(response.content)) {
        todasReservas = response.content;
      } else if (Array.isArray(response)) {
        todasReservas = response;
      }
      
      const agora = new Date();
      const vencidas = todasReservas.filter(reserva => {
        if (!reserva.dtLimite) return false;
        const dataLimite = new Date(reserva.dtLimite);
        return dataLimite < agora;
      });
      
      console.log('Reservas vencidas encontradas:', vencidas.length);
      setReservasVencidas(vencidas);
    } catch (err) {
      setError('Erro ao carregar inconsistências. Tente novamente mais tarde.');
      console.error('Erro ao carregar inconsistências:', err);
      setReservasVencidas([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSelectReserva = (reservaId) => {
    setSelectedReservas(prev => 
      prev.includes(reservaId) 
        ? prev.filter(id => id !== reservaId)
        : [...prev, reservaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReservas.length === reservasVencidas.length) {
      setSelectedReservas([]);
    } else {
      setSelectedReservas(reservasVencidas.map(r => r.id));
    }
  };

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await reservaService.deletarReserva(reservaId);
      alert('Reserva cancelada com sucesso!');
      carregarReservasVencidas();
      setExpandedIndex(null);
    } catch (err) {
      alert('Erro ao cancelar reserva. Tente novamente.');
      console.error('Erro ao cancelar reserva:', err);
    }
  };

  const handleEntrarEmContato = (reserva) => {
    const usuario = reserva.usuario || reserva.usuarios;
    if (usuario?.email) {
      const assunto = `Reserva Vencida - ID ${reserva.id}`;
      const corpo = `Olá ${usuario.nomeCompleto},\n\nNotamos que sua reserva (ID: ${reserva.id}) não foi retirada no prazo.\n\nPor favor, entre em contato conosco.`;
      window.location.href = `mailto:${usuario.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    } else {
      alert('Email do cliente não disponível.');
    }
  };

  const calcularDiasAtrasados = (dataLimite) => {
    if (!dataLimite) return 'Data não definida';
    
    const hoje = new Date();
    const limite = new Date(dataLimite);
    const diffTime = hoje - limite;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return '-1 dia';
    return `-${diffDays} dias`;
  };

  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservas = reservasVencidas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservasVencidas.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedIndex(null);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="tabela-container">
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Carregando inconsistências...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabela-container">
        <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c', backgroundColor: '#fee', borderRadius: '8px', margin: '20px' }}>
          {error}
          <button 
            onClick={carregarReservasVencidas} 
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>
          Inconsistências - Reservas Vencidas
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {reservasVencidas.length} reserva(s) vencida(s)
          </span>
          <button 
            onClick={carregarReservasVencidas}
            style={{
              padding: '8px 16px',
              backgroundColor: '#123b64',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <i className="bx bx-refresh"></i> Atualizar
          </button>
        </div>
      </div>

      {reservasVencidas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#27ae60', fontSize: '18px' }}>
          <i className="bx bx-check-circle" style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}></i>
          <p>Nenhuma inconsistência encontrada!</p>
          <p style={{ fontSize: '14px', color: '#999' }}>Todas as reservas estão dentro do prazo.</p>
        </div>
      ) : (
        <>
          <table className="tabela">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedReservas.length === reservasVencidas.length && reservasVencidas.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Cliente</th>
                <th>Data da Reserva</th>
                <th>Data Limite</th>
                <th>Atrasado</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentReservas.map((reserva, index) => {
                const usuario = reserva.usuario || reserva.usuarios;
                const totalLivros = reserva.livros?.length || 0;
                const valorTotal = reserva.valorTotal || reserva.totalReserva || 0;
                
                return (
                  <React.Fragment key={reserva.id || `reserva-${index}`}>
                    <tr>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedReservas.includes(reserva.id)}
                          onChange={() => handleSelectReserva(reserva.id)}
                        />
                      </td>
                      <td>
                        <div className="autor-cell">
                          <i className="bx bx-user"></i>
                          <div className="autor-info">
                            <span className="autor-nome">
                              {usuario?.nomeCompleto || 'Cliente não identificado'}
                            </span>
                            <span className="autor-role">Requerente</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatarData(reserva.dtReserva)}</td>
                      <td>{formatarData(reserva.dtLimite)}</td>
                      <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        {calcularDiasAtrasados(reserva.dtLimite)}
                      </td>
                      <td>{totalLivros}</td>
                      <td>
                        <span className="status-badge status-inconsistente">
                          Inconsistente
                        </span>
                      </td>
                      <td>
                        <button
                          className={`arrow-btn ${expandedIndex === index ? "open" : ""}`}
                          onClick={() => toggleExpand(index)}
                        >
                          <i className="bx bx-chevron-down"></i>
                        </button>
                      </td>
                    </tr>

                    {expandedIndex === index && (
                      <tr className="detalhes-row">
                        <td colSpan="8">
                          <div className="detalhes-container">
                            <div className="detalhes-livros-lista">
                              <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e0e0e0' }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#e74c3c', fontSize: '20px' }}>
                                  ⚠️ Reserva Vencida - ID #{reserva.id}
                                </h3>
                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                  gap: '10px', 
                                  backgroundColor: '#fff3cd', 
                                  padding: '15px', 
                                  borderRadius: '8px',
                                  border: '1px solid #ffc107'
                                }}>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#856404' }}>
                                    <strong>Cliente:</strong> {usuario?.nomeCompleto}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#856404' }}>
                                    <strong>Email:</strong> {usuario?.email || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#856404' }}>
                                    <strong>Telefone:</strong> {usuario?.telefone || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#856404' }}>
                                    <strong>Data da Reserva:</strong> {formatarData(reserva.dtReserva)}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#e74c3c' }}>
                                    <strong>Data Limite:</strong> {formatarData(reserva.dtLimite)}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#e74c3c', fontWeight: 'bold' }}>
                                    <strong>Atrasado:</strong> {calcularDiasAtrasados(reserva.dtLimite)}
                                  </p>
                                </div>
                              </div>

                              {reserva.livros && reserva.livros.length > 0 ? (
                                reserva.livros.map((livro, i) => (
                                  <div key={i} className="detalhes-livro">
                                    <img 
                                      src={livro.imagemCapa || livro.imagemUrl || 'https://via.placeholder.com/150x200?text=Sem+Capa'} 
                                      alt={`Capa de ${livro.titulo}`} 
                                      className="detalhes-capa"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150x200?text=Sem+Capa';
                                      }}
                                    />
                                    <div className="detalhes-info">
                                      <h3>{livro.titulo}</h3>
                                      <p><strong>Autor:</strong> {livro.autor}</p>
                                      <p><strong>ISBN:</strong> {livro.isbn || 'N/A'}</p>
                                      <p><strong>Editora:</strong> {livro.editora || 'N/A'}</p>
                                      <p><strong>Ano:</strong> {livro.anoPublicacao || 'N/A'}</p>
                                      <p><strong>Páginas:</strong> {livro.numeroPaginas || livro.paginas || 'N/A'}</p>
                                      <p><strong>Categoria:</strong> {livro.categoria || 'N/A'}</p>
                                      <p className="reserva-total">
                                        Preço: R$ {(livro.preco || 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                  Nenhum livro associado a esta reserva.
                                </p>
                              )}
                            </div>

                            <div className="detalhes-footer">
                              <p className="reserva-total">
                                <strong>Total da Reserva:</strong> R$ {(valorTotal / 100).toFixed(2)}
                              </p>
                              <div className="detalhes-botoes">
                                <button 
                                  className="cancelar-btn"
                                  onClick={() => handleCancelarReserva(reserva.id)}
                                >
                                  Cancelar Reserva
                                </button>
                                <button 
                                  className="concluir-btn"
                                  onClick={() => handleEntrarEmContato(reserva)}
                                >
                                  Entrar em Contato
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="tabela-pagination">
            <span 
              onClick={prevPage}
              style={{ 
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &lt;
            </span>
            <span style={{ fontSize: '14px', color: '#666', padding: '0 15px' }}>
              Página {currentPage} de {totalPages} ({reservasVencidas.length} inconsistências)
            </span>
            <span 
              onClick={nextPage}
              style={{ 
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              &gt;
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Inconsistencias;