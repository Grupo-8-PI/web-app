import api from './api';

const reservaService = {
  listarReservas: async (page = 0, size = 100) => {
    try {
      const response = await api.get(`/reservas?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      throw error;
    }
  },

  buscarReservaPorId: async (id) => {
    try {
      const response = await api.get(`/reservas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      throw error;
    }
  },

  buscarPorCliente: async (clienteId) => {
    try {
      const response = await api.get(`/reservas/user/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reservas por cliente:', error);
      throw error;
    }
  },

  /**
   * Creates a new reservation (secure API)
   * @param {Object} reservaData - Reservation data
   * @param {number} reservaData.livroId - REQUIRED - ID of the book
   * @param {string} [reservaData.statusReserva] - OPTIONAL - defaults to "Confirmada"
   * @returns {Promise<Object>} Response with server-calculated fields
   */
  criarReserva: async (reservaData) => {
    try {
      const response = await api.post('/reservas', reservaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  },

  atualizarReserva: async (id, reservaData) => {
    try {
      const response = await api.put(`/reservas/${id}`, reservaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  },

  deletarReserva: async (id) => {
    try {
      const response = await api.delete(`/reservas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      throw error;
    }
  },

  
  buscarPorStatus: async (status) => {
    console.warn('Endpoint /reservas/status/{status} não existe no backend');
    const reservas = await reservaService.listarReservas(0, 1000);
    return reservas.content?.filter(r => r.status === status) || [];
  },

  concluirReserva: async (id) => {
    console.warn('Endpoint /reservas/{id}/concluir não existe no backend');
    return await reservaService.atualizarReserva(id, { status: 'CONCLUIDA' });
  },

  cancelarReserva: async (id) => {
    return await reservaService.deletarReserva(id);
  }
};

export default reservaService;