import React, { useState, useEffect } from "react";
import reservaService from "../../services/reservaService";
import livroService from "../../services/livroService";
import usuarioService from "../../services/usuarioService";
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
      
      console.log('🚀 Carregando reservas (ADMIN)...');
      
      // Buscar TODAS as reservas (ADMIN)
      const response = await reservaService.listarReservas(0, 100);
      
      console.log('📦 Resposta do backend:', response);
      
      // Backend retorna: { reservas: [], page, size, totalElements, totalPages }
      let reservasDoBackend = [];
      
      if (response && Array.isArray(response.reservas)) {
        reservasDoBackend = response.reservas;
      } else if (Array.isArray(response.content)) {
        reservasDoBackend = response.content;
      } else if (Array.isArray(response)) {
        reservasDoBackend = response;
      }

      console.log('📚 Total de reservas encontradas:', reservasDoBackend.length);

      // Para cada reserva, buscar dados do livro e do usuário
      const reservasCompletas = await Promise.all(
        reservasDoBackend.map(async (reserva) => {
          try {
            // Buscar livro
            let livro = null;
            if (reserva.livroId) {
              try {
                livro = await livroService.buscarPorId(reserva.livroId);
                console.log(`✅ Livro ${reserva.livroId} encontrado:`, livro.titulo);
              } catch (err) {
                console.warn(`⚠️ Erro ao buscar livro ${reserva.livroId}:`, err);
              }
            }

            // Buscar dados do cliente
            let cliente = {
              nome: 'Cliente não identificado',
              email: 'Sem email',
              telefone: 'N/A'
            };

            // Tentar buscar pelo endpoint de reservas que deve retornar dados do usuário
            // Ou buscar usuário se o backend retornar usuarioId
            if (reserva.usuarioId) {
              try {
                const usuarioData = await usuarioService.getUsuarioById(reserva.usuarioId);
                cliente = {
                  nome: usuarioData.nome || 'Cliente não identificado',
                  email: usuarioData.email || 'Sem email',
                  telefone: usuarioData.telefone || 'N/A'
                };
                console.log(`✅ Cliente ${reserva.usuarioId} encontrado:`, cliente.nome);
              } catch (err) {
                console.warn(`⚠️ Erro ao buscar cliente ${reserva.usuarioId}:`, err);
              }
            }

            return {
              id: reserva.id,
              cliente: cliente,
              livros: livro ? [{
                titulo: livro.titulo,
                autor: livro.autor,
                isbn: livro.isbn,
                editora: livro.editora,
                anoPublicacao: livro.anoPublicacao,
                numeroPaginas: livro.paginas,
                categoria: livro.nomeCategoria,
                preco: livro.preco,
                imagemUrl: livro.capa
              }] : [],
              dataReserva: reserva.dtReserva,
              dataRetirada: reserva.dtLimite,
              status: reserva.statusReserva,
              valorTotal: reserva.totalReserva,
              livroId: reserva.livroId
            };
          } catch (error) {
            console.error(`❌ Erro ao processar reserva ${reserva.id}:`, error);
            return {
              id: reserva.id,
              cliente: {
                nome: 'Erro ao carregar',
                email: 'Erro',
                telefone: 'N/A'
              },
              livros: [],
              dataReserva: reserva.dtReserva,
              dataRetirada: reserva.dtLimite,
              status: reserva.statusReserva,
              valorTotal: reserva.totalReserva
            };
          }
        })
      );

      console.log('✅ Reservas processadas:', reservasCompletas);

      // Filtrar por status se necessário
      let reservasFiltradas = reservasCompletas;
      if (filtroStatus !== 'TODOS') {
        reservasFiltradas = reservasCompletas.filter(r => r.status === filtroStatus);
      }

      setReservas(reservasFiltradas);
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
      await reservaService.cancelarReserva(reservaId);
      alert('Reserva cancelada com sucesso!');
      carregarReservas();
      setExpandedIndex(null);
    } catch (err) {
      alert('Erro ao cancelar reserva. Tente novamente.');
      console.error('Erro ao cancelar reserva:', err);
    }
  };

  const handleConcluirReserva = async (reservaId) => {
    if (!window.confirm('Tem certeza que deseja concluir esta reserva?')) {
      return;
    }

    try {
      await reservaService.concluirReserva(reservaId);
      alert('Reserva concluída com sucesso!');
      carregarReservas();
      setExpandedIndex(null);
    } catch (err) {
      alert('Erro ao concluir reserva. Tente novamente.');
      console.error('Erro ao concluir reserva:', err);
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
    if (!data) return 'Invalid Date';
    
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
          Carregando reservas...
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
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>Gerenciamento de Reservas</h2>
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
          <p>Nenhuma reserva encontrada.</p>
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
                const totalLivros = reserva.livros?.length || 0;
                const titulosLivros = reserva.livros?.map(l => l.titulo).join(' + ') || 'N/A';
                const valorTotal = reserva.valorTotal || 0;
                
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
                      <td>{formatarData(reserva.dataReserva)}</td>
                      <td>{formatarData(reserva.dataRetirada)}</td>
                      <td>{calcularDiasRestantes(reserva.dataRetirada)}</td>
                      <td>{totalLivros}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(reserva.status)}`}>
                          {getStatusLabel(reserva.status)}
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
                                  Detalhes da Reserva #{reserva.id}
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
                                    <strong>Cliente:</strong> {reserva.cliente?.nome}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Email:</strong> {reserva.cliente?.email}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Telefone:</strong> {reserva.cliente?.telefone || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Data de Criação:</strong> {formatarData(reserva.dataReserva)}
                                  </p>
                                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Data de Retirada:</strong> {formatarData(reserva.dataRetirada)}
                                  </p>
                                </div>
                              </div>

                              {reserva.livros && reserva.livros.length > 0 ? (
                                reserva.livros.map((livro, i) => (
                                  <div key={i} className="detalhes-livro">
                                    <img 
                                      src={livro.imagemUrl || 'https://via.placeholder.com/150x200?text=Sem+Capa'} 
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
                                      <p><strong>Páginas:</strong> {livro.numeroPaginas || 'N/A'}</p>
                                      <p><strong>Categoria:</strong> {livro.categoria || 'N/A'}</p>
                                      <p className="reserva-total">
                                        Preço: R$ {(livro.preco || 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                                  Nenhum livro associado a esta reserva.
                                </p>
                              )}
                            </div>

                            <div className="detalhes-footer">
                              <p className="reserva-total">
                                <strong>Total da Reserva:</strong> R$ {valorTotal.toFixed(2)}
                              </p>
                              
                              {/* TEMPORÁRIO: Botões desabilitados até backend implementar endpoint ADMIN */}
                              <div style={{ 
                                padding: '20px', 
                                backgroundColor: '#fff3cd', 
                                borderRadius: '8px',
                                color: '#856404',
                                textAlign: 'center',
                                marginTop: '15px'
                              }}>
                                <i className='bx bx-info-circle' style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                                <p style={{ margin: '0', fontSize: '16px' }}>
                                  <strong>Ações de Atualização Indisponíveis</strong>
                                </p>
                                <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
                                  O backend precisa implementar endpoint específico para ADMIN atualizar status de reservas.
                                  <br />
                                  Veja o arquivo <code>ERRO_403_SOLUCAO.md</code> para detalhes.
                                </p>
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