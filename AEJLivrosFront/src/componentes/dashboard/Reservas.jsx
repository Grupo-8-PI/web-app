import React, { useState, useEffect } from "react";
import reservaService from "../../services/reservaService";
import usuarioService from "../../services/usuarioService";
import livroService from "../../services/livroService";
import "./Tabela.css";

const Reservas = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservas, setSelectedReservas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const itemsPerPage = 10;

  // Carregar reservas ao montar o componente
  useEffect(() => {
    carregarReservas();
  }, [filtroStatus]);

  const carregarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Carregando reservas...');
      
      let response;
      if (filtroStatus === 'TODOS') {
        response = await reservaService.listarReservas(0, 100);
      } else {
        response = await reservaService.buscarPorStatus(filtroStatus);
      }
      
      console.log('📦 Resposta do backend:', response);
      
      // ✅ Backend retorna estrutura paginada: { reservas: [], totalElements: X, ... }
      let reservasData = [];
      if (response && Array.isArray(response.reservas)) {
        console.log('✅ Encontrou response.reservas');
        reservasData = response.reservas;
      } else if (response && Array.isArray(response.content)) {
        console.log('✅ Encontrou response.content');
        reservasData = response.content;
      } else if (Array.isArray(response)) {
        console.log('✅ Response é array direto');
        reservasData = response;
      } else if (response && typeof response === 'object') {
        console.log('✅ Response é objeto único, transformando em array');
        reservasData = [response];
      } else {
        console.log('❌ Nenhum formato reconhecido, setando array vazio');
        reservasData = [];
      }

      console.log(`📚 Total de reservas encontradas: ${reservasData.length}`);

      // ✅ ENRIQUECER RESERVAS COM DADOS DO CLIENTE E LIVROS
      console.log(`📦 Enriquecendo ${reservasData.length} reservas com dados completos...`);
      
      const reservasEnriquecidas = await Promise.all(
        reservasData.map(async (reserva) => {
          try {
            // 1️⃣ Buscar dados do cliente
            let clienteCompleto = null;
            if (reserva.usuarioId) {
              console.log(`👤 Buscando cliente ID: ${reserva.usuarioId}`);
              try {
                clienteCompleto = await usuarioService.getUsuarioById(reserva.usuarioId);
                console.log(`✅ Cliente encontrado:`, clienteCompleto.nome);
              } catch (error) {
                console.error(`❌ Erro ao buscar cliente ${reserva.usuarioId}:`, error);
                clienteCompleto = {
                  id: reserva.usuarioId,
                  nome: 'Cliente não encontrado',
                  email: 'N/A',
                  telefone: 'N/A'
                };
              }
            }

            // 2️⃣ Buscar dados dos livros
            let livrosCompletos = [];
            
            // ✅ IMPORTANTE: livroId pode ser NUMBER ou ARRAY
            let livroIds = [];
            
            if (reserva.livroId) {
              if (Array.isArray(reserva.livroId)) {
                // É array: [10, 15, 20]
                livroIds = reserva.livroId;
                console.log(`📚 livroId é ARRAY com ${livroIds.length} livros:`, livroIds);
              } else if (typeof reserva.livroId === 'number') {
                // É número: 40 → transformar em array [40]
                livroIds = [reserva.livroId];
                console.log(`📚 livroId é NUMBER, transformado em array:`, livroIds);
              } else {
                console.log(`⚠️ livroId tem tipo inesperado:`, typeof reserva.livroId, reserva.livroId);
              }
            }
            
            if (livroIds.length > 0) {
              console.log(`📚 Buscando ${livroIds.length} livros:`, livroIds);
              try {
                livrosCompletos = await livroService.getLivrosByIds(livroIds);
                console.log(`✅ Livros encontrados (${livrosCompletos.length})`);
                
                // Debug: Verificar capas dos livros
                livrosCompletos.forEach((livro, idx) => {
                  console.log(`📖 Livro ${idx + 1}:`, {
                    id: livro.id,
                    titulo: livro.titulo,
                    capa: livro.capa || livro.imagemUrl,
                    preco: livro.preco
                  });
                });
              } catch (error) {
                console.error(`❌ Erro ao buscar livros:`, error);
                console.error(`❌ Detalhes do erro:`, error.response?.data);
                // Se falhar, criar objetos placeholder
                livrosCompletos = livroIds.map((id) => ({
                  id: id,
                  titulo: `Livro ID ${id}`,
                  autor: 'Autor não encontrado',
                  isbn: 'N/A',
                  preco: 0,
                  capa: null
                }));
              }
            } else {
              console.log(`⚠️ Nenhum livroId encontrado na reserva ${reserva.id}`);
            }

            // 3️⃣ Retornar reserva enriquecida
            return {
              ...reserva,
              cliente: clienteCompleto,
              livros: livrosCompletos,
              // Quantidade: se for array, pegar length; se for número, é 1 livro
              quantidadeLivros: Array.isArray(reserva.livroId) 
                ? reserva.livroId.length 
                : (reserva.livroId ? 1 : 0)
            };
          } catch (error) {
            console.error(`❌ Erro ao enriquecer reserva ${reserva.id}:`, error);
            return {
              ...reserva,
              cliente: {
                nome: 'Erro ao carregar',
                email: 'N/A',
                telefone: 'N/A'
              },
              livros: [],
              quantidadeLivros: 0
            };
          }
        })
      );

      console.log('✅ Reservas enriquecidas:', reservasEnriquecidas.length);
      setReservas(reservasEnriquecidas);
    } catch (err) {
      setError('Erro ao carregar reservas. Tente novamente mais tarde.');
      console.error('❌ Erro ao carregar reservas:', err);
      setReservas([]);
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
    if (selectedReservas.length === reservasArray.length) {
      setSelectedReservas([]);
    } else {
      setSelectedReservas(reservasArray.map(r => r.id));
    }
  };

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      console.log('🚫 Cancelando reserva:', reservaId);
      await reservaService.cancelarReserva(reservaId);
      alert('Reserva cancelada com sucesso!');
      carregarReservas();
      setExpandedIndex(null);
    } catch (err) {
      console.error('❌ Erro ao cancelar reserva:', err);
      alert(`Erro ao cancelar reserva: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleConcluirReserva = async (reservaId) => {
    if (!window.confirm('Tem certeza que deseja concluir esta reserva?')) {
      return;
    }

    try {
      console.log('✅ Concluindo reserva:', reservaId);
      await reservaService.concluirReserva(reservaId);
      alert('Reserva concluída com sucesso!');
      carregarReservas();
      setExpandedIndex(null);
    } catch (err) {
      console.error('❌ Erro ao concluir reserva:', err);
      alert(`Erro ao concluir reserva: ${err.response?.data?.message || err.message}`);
    }
  };

  const calcularDiasRestantes = (dataRetirada) => {
    if (!dataRetirada) return 'N/A';
    
    try {
      const hoje = new Date();
      const dataRetiradaObj = new Date(dataRetirada);
      
      if (isNaN(dataRetiradaObj.getTime())) return 'Data inválida';
      
      const diffTime = dataRetiradaObj - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Vencida';
      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return '1 dia';
      return `${diffDays} dias`;
    } catch (error) {
      return 'N/A';
    }
  };

  const formatarData = (data) => {
    if (!data) return 'N/A';
    
    try {
      const dataObj = new Date(data);
      if (isNaN(dataObj.getTime())) return 'Invalid Date';
      return dataObj.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'PENDENTE': 'status-inconsistente',
      'APROVADA': 'status-ok',
      'CONCLUIDA': 'status-ok',
      'CANCELADA': 'status-inconsistente',
      'REJEITADA': 'status-inconsistente'
    };
    return statusMap[status] || 'status-ok';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'PENDENTE': 'Pendente',
      'APROVADA': 'Aprovada',
      'CONCLUIDA': 'Concluída',
      'CANCELADA': 'Cancelada',
      'REJEITADA': 'Rejeitada'
    };
    return labelMap[status] || status;
  };

  // Paginação
  const reservasArray = Array.isArray(reservas) ? reservas : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservas = reservasArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservasArray.length / itemsPerPage);

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
          📚 Carregando reservas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabela-container">
        <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c', backgroundColor: '#fee', borderRadius: '8px', margin: '20px' }}>
          ❌ {error}
          <button 
            onClick={carregarReservas} 
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
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>📋 Gerenciamento de Reservas</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#2c3e50' }}>Filtrar por Status:</label>
          <select 
            value={filtroStatus} 
            onChange={(e) => {
              setFiltroStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="TODOS">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="APROVADA">Aprovada</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      </div>

      {reservasArray.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '18px' }}>
          <p>📚 Nenhuma reserva encontrada.</p>
        </div>
      ) : (
        <>
          <table className="tabela">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedReservas.length === reservasArray.length && reservasArray.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Cliente</th>
                <th>Livros</th>
                <th>Data da Reserva</th>
                <th>Data de Retirada</th>
                <th>Faltam</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentReservas.map((reserva, index) => {
                // ✅ Mapear campos do backend (aceita ambos os formatos)
                const dataReserva = reserva.dtReserva || reserva.dataReserva;
                const dataRetirada = reserva.dtLimite || reserva.dataRetirada;
                const status = reserva.statusReserva || reserva.status || 'PENDENTE';
                const valorTotal = reserva.totalReserva || reserva.valorTotal || 0;
                
                // ✅ Usar quantidadeLivros já calculada no carregarReservas
                const totalLivros = reserva.quantidadeLivros || 0;
                const titulosLivros = reserva.livros?.map(l => l.titulo).join(' + ') || 'N/A';
                
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
                              {reserva.cliente?.nome || 'Cliente não identificado'}
                            </span>
                            <span className="sub">
                              {reserva.cliente?.email || 'Sem email'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {titulosLivros}
                      </td>
                      <td>{formatarData(dataReserva)}</td>
                      <td>{formatarData(dataRetirada)}</td>
                      <td>{calcularDiasRestantes(dataRetirada)}</td>
                      <td>{totalLivros}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                          {getStatusLabel(status)}
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
                        <td colSpan="9">
                          <div className="detalhes-container">
                            <div className="detalhes-livros-lista">
                              <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e0e0e0' }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '20px' }}>
                                  📋 Detalhes da Reserva #{reserva.id}
                                </h3>
                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                  gap: '10px', 
                                  backgroundColor: '#f8f9fa', 
                                  padding: '15px', 
                                  borderRadius: '8px' 
                                }}>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Cliente:</strong> {reserva.cliente?.nome || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Email:</strong> {reserva.cliente?.email || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Telefone:</strong> {reserva.cliente?.telefone || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Data de Criação:</strong> {formatarData(dataReserva)}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Data de Retirada:</strong> {formatarData(dataRetirada)}
                                  </p>
                                </div>
                              </div>

                              {reserva.livros && reserva.livros.length > 0 ? (
                                reserva.livros.map((livro, i) => (
                                  <div key={i} className="detalhes-livro">
                                    <img 
                                      src={livro.capa || livro.imagemUrl || 'https://via.placeholder.com/150x200?text=Sem+Capa'} 
                                      alt={`Capa de ${livro.titulo}`} 
                                      className="detalhes-capa"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150x200?text=Sem+Capa';
                                      }}
                                      loading="lazy"
                                    />
                                    <div className="detalhes-info">
                                      <h3>{livro.titulo || 'Título não disponível'}</h3>
                                      <p><strong>Autor:</strong> {livro.autor || 'N/A'}</p>
                                      <p><strong>Ano:</strong> {livro.anoPublicacao || 'N/A'}</p>
                                      <p><strong>Idioma:</strong> {livro.idioma || 'Português'}</p>
                                      <p><strong>Páginas:</strong> {livro.paginas || livro.numeroPaginas || 'N/A'}</p>
                                      <p><strong>Conservação:</strong> {livro.estadoConservacao || 'N/A'}</p>
                                      <p><strong>Categoria:</strong> {livro.nomeCategoria || livro.categoria || 'N/A'}</p>
                                      <p><strong>ISBN:</strong> {livro.isbn || 'N/A'}</p>
                                      <p><strong>Editora:</strong> {livro.editora || 'N/A'}</p>
                                      <p className="reserva-total">
                                        💰 Preço: R$ {(livro.preco || 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                                  📚 Nenhum livro associado a esta reserva.
                                </p>
                              )}
                            </div>

                            <div className="detalhes-footer">
                              {reserva.observacoes && (
                                <div style={{ 
                                  backgroundColor: '#f8f9fa', 
                                  padding: '15px', 
                                  borderRadius: '8px', 
                                  marginBottom: '15px',
                                  width: '100%'
                                }}>
                                  <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                                    <strong>📝 Observações:</strong> {reserva.observacoes}
                                  </p>
                                </div>
                              )}
                              <p className="reserva-total">
                                <strong>💰 Total da Reserva:</strong> R$ {valorTotal.toFixed(2)}
                              </p>
                              <div className="detalhes-botoes">
                                <button 
                                  className="cancelar-btn"
                                  onClick={() => handleCancelarReserva(reserva.id)}
                                  disabled={status === 'CANCELADA' || status === 'CONCLUIDA'}
                                  style={{ 
                                    opacity: (status === 'CANCELADA' || status === 'CONCLUIDA') ? 0.5 : 1,
                                    cursor: (status === 'CANCELADA' || status === 'CONCLUIDA') ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  🚫 Cancelar Reserva
                                </button>
                                <button 
                                  className="concluir-btn"
                                  onClick={() => handleConcluirReserva(reserva.id)}
                                  disabled={status === 'CANCELADA' || status === 'CONCLUIDA'}
                                  style={{ 
                                    opacity: (status === 'CANCELADA' || status === 'CONCLUIDA') ? 0.5 : 1,
                                    cursor: (status === 'CANCELADA' || status === 'CONCLUIDA') ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  ✅ Concluir Reserva
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
              Página {currentPage} de {totalPages} ({reservasArray.length} reservas)
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

export default Reservas;