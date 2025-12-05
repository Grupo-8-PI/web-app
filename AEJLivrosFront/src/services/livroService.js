import api from "./api";

const livroService = {
  getLivroById: async (id) => {
    try {
      console.log(`🔍 Buscando livro ID ${id}...`);
      const response = await api.get(`/livros/${id}`);
      console.log(`✅ Livro ${id} encontrado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar livro ${id}:`, error);
      console.error(`❌ Status:`, error.response?.status);
      console.error(`❌ Dados:`, error.response?.data);
      throw error;
    }
  },

  getLivrosByIds: async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        console.log('⚠️ Array de IDs vazio, retornando array vazio');
        return [];
      }

      console.log(`📚 Iniciando busca de ${ids.length} livros em paralelo...`);
      console.log(`📚 IDs a buscar:`, ids);

      // Buscar todos os livros em paralelo
      const promises = ids.map(id => livroService.getLivroById(id));
      const livros = await Promise.all(promises);
      
      console.log(`✅ Busca concluída! ${livros.length} livros retornados`);
      return livros;
    } catch (error) {
      console.error('❌ Erro ao buscar livros em lote:', error);
      throw error;
    }
  },

  listarLivros: async () => {
    try {
      const response = await api.get('/livros');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      throw error;
    }
  }
};

export default livroService;