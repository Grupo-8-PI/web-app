import api from './api';

const livroService = {
  // Listar todos os livros (paginado)
  listarLivros: async (page = 0, size = 9) => {
    try {
      const response = await api.get(`/livros?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      throw error;
    }
  },

  // Buscar livro por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/livros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar livro ${id}:`, error);
      throw error;
    }
  },

  // Criar novo livro
  criarLivro: async (livroData) => {
    try {
      const response = await api.post('/livros', livroData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw error;
    }
  },

  // Atualizar livro
  atualizarLivro: async (id, livroData) => {
    try {
      const response = await api.put(`/livros/${id}`, livroData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      throw error;
    }
  },

  // Deletar livro
  deletarLivro: async (id) => {
    try {
      const response = await api.delete(`/livros/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      throw error;
    }
  },

  // Buscar livros por categoria
  buscarPorCategoria: async (categoriaId) => {
    try {
      const response = await api.get(`/livros/categoria/${categoriaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros por categoria:', error);
      throw error;
    }
  },

  // Buscar livros recentes
  buscarRecentes: async () => {
    try {
      const response = await api.get('/livros/recentes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros recentes:', error);
      throw error;
    }
  },

  // Buscar livros recomendados
  buscarRecomendados: async () => {
    try {
      const response = await api.get('/livros/recomendados');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros recomendados:', error);
      throw error;
    }
  },

  // Upload de capa do livro
  uploadCapa: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/livros/${id}/capa`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da capa:', error);
      throw error;
    }
  },

  // Listar todas as categorias
  listarCategorias: async () => {
    try {
      const response = await api.get('/livros/categorias');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  }
};

export default livroService;