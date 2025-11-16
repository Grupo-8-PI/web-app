import api from "../services/api";

const usuarioService = {
  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  updateUsuario: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },

  getComprasUsuario: async (userId) => {
    try {
      const response = await api.get(`/vendas/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      throw error;
    }
  }
};

export default usuarioService;