import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: "/api",  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout();
      return Promise.reject(new Error('Sessão expirada'));
    }
    return Promise.reject(error);
  }
);

/**
 * Creates a new reservation (secure API)
 * @param {Object} payload - Reservation data
 * @param {number} payload.livroId - REQUIRED - ID of the book to reserve
 * @param {string} [payload.statusReserva] - OPTIONAL - defaults to "Confirmada"
 * @returns {Promise} Response with server-calculated dtReserva, dtLimite, and totalReserva
 * 
 * SECURITY NOTE:
 * - dtReserva is AUTO-SET by server to current time
 * - dtLimite is AUTO-SET by server to dtReserva + 48 hours
 * - totalReserva is AUTO-SET by server from livro.preco
 * - Do NOT send these fields from client (security risk)
 */
export const criarReserva = (payload) => {
  return api.post('/reservas', payload);
};

export const listarReservasUsuario = (idUsuario) => {
  return api.get(`/reservas/user/${idUsuario}`);
};

export const cancelarReserva = (id) => {
  return api.delete(`/reservas/${id}`);
};

export const buscarLivroPorId = (livroId) => {
  return api.get(`/livros/${livroId}`);
};

export default api;
