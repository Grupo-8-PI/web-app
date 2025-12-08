import api from './api';
import { normalizeStatus, STATUS } from '../utils/statusUtils';

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
    // Backend não tem endpoint /reservas/status/{status}
    // Filtrar localmente após buscar todas as reservas
    const reservas = await reservaService.listarReservas(0, 1000);
    const normalizedStatus = normalizeStatus(status);
    const items = reservas.content || reservas.reservas || reservas || [];
    return items.filter(r => normalizeStatus(r.statusReserva) === normalizedStatus);
  },

  concluirReserva: async (id) => {
    // Backend não tem endpoint /reservas/{id}/concluir
    // Usar PUT /reservas/{id} para atualizar o status
    return await reservaService.atualizarReserva(id, { statusReserva: STATUS.CONCLUIDA });
  },

  /**
   * Cancela uma reserva usando DELETE (backend remove a reserva)
   * ⚠️ NOTA: Backend deleta a reserva completamente, não apenas atualiza status
   * Para manter histórico, considere usar atualizarReserva com STATUS.CANCELADA
   */
  cancelarReserva: async (id) => {
    return await reservaService.deletarReserva(id);
  },

  /**
   * Cancela uma reserva atualizando o status (alternativa que mantém histórico)
   * Use este método se quiser preservar o histórico de reservas canceladas
   */
  cancelarReservaPorStatus: async (id) => {
    return await reservaService.atualizarReserva(id, { statusReserva: STATUS.CANCELADA });
  }
};

export default reservaService;