import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8080',
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

// Reservas
export const criarReserva = (dtReserva, dtLimite, statusReserva, totalReserva, dadosLivro) => {
  return api.post('/reservas', {
    dtReserva,
    dtLimite,
    statusReserva,
    totalReserva,
    ...dadosLivro
  });
};

export const listarReservasUsuario = (userId) => {
  return api.get(`/reservas/user/${userId}`);
};

// Livros
export const buscarLivroPorId = (livroId) => {
  return api.get(`/livros/${livroId}`);
};

export default api;