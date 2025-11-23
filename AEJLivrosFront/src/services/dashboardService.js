import api from './api';

const dashboardService = {
    async getAllLivros(page = 0, size = 1000) {
        try {
            const response = await api.get(`/livros?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    },

    async getAllReservas(page = 0, size = 1000) {
        try {
            const response = await api.get(`/reservas?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar reservas:', error);
            throw error;
        }
    },

    async getLivrosByCategoria(categoriaId) {
        try {
            const response = await api.get(`/livros/categoria/${categoriaId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar livros por categoria:', error);
            throw error;
        }
    },

    async getLivrosByConservacao(conservacaoId) {
        try {
            const response = await api.get(`/livros/conservacao/${conservacaoId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar livros por conservação:', error);
            throw error;
        }
    },

    async getCategorias() {
        try {
            const response = await api.get(`/livros/categorias`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
    },

    async getDashboardStats() {
        try {
            const livrosResponse = await this.getAllLivros(0, 1000);
            
            // Backend retorna: { livros: [...], currentPage: 0, totalElements: 3, totalPages: 1 }
            let livros = [];
            if (livrosResponse.livros && Array.isArray(livrosResponse.livros)) {
                livros = livrosResponse.livros;
            } else if (livrosResponse.content && Array.isArray(livrosResponse.content)) {
                livros = livrosResponse.content;
            } else if (Array.isArray(livrosResponse)) {
                livros = livrosResponse;
            }

            const reservasResponse = await this.getAllReservas(0, 1000);
            
            // Backend pode retornar: { reservas: [...] } ou { content: [...] }
            let reservas = [];
            if (reservasResponse.reservas && Array.isArray(reservasResponse.reservas)) {
                reservas = reservasResponse.reservas;
            } else if (reservasResponse.content && Array.isArray(reservasResponse.content)) {
                reservas = reservasResponse.content;
            } else if (Array.isArray(reservasResponse)) {
                reservas = reservasResponse;
            }

            return this.calculateStats(livros, reservas);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    },

    calculateStats(livros, reservas) {
        // Valor total do estoque
        const valorEstoque = livros.reduce((sum, livro) => sum + (livro.preco || 0), 0);

        // Contagem por conservação
        const conservacaoCounts = {
            excelente: 0,
            bom: 0,
            razoavel: 0,
            degradado: 0
        };

        livros.forEach(livro => {
            switch (livro.conservacaoId) {
                case 1:
                    conservacaoCounts.excelente++;
                    break;
                case 2:
                    conservacaoCounts.bom++;
                    break;
                case 3:
                    conservacaoCounts.razoavel++;
                    break;
                case 4:
                    conservacaoCounts.degradado++;
                    break;
            }
        });

        const totalLivros = livros.length;
        const percentExcelente = totalLivros > 0 ? ((conservacaoCounts.excelente / totalLivros) * 100).toFixed(0) : 0;
        const percentBom = totalLivros > 0 ? ((conservacaoCounts.bom / totalLivros) * 100).toFixed(0) : 0;
        const percentRazoavel = totalLivros > 0 ? ((conservacaoCounts.razoavel / totalLivros) * 100).toFixed(0) : 0;
        const percentDegradado = totalLivros > 0 ? ((conservacaoCounts.degradado / totalLivros) * 100).toFixed(0) : 0;

        // Contagem por categoria
        const categoriaMap = {};
        livros.forEach(livro => {
            const categoria = livro.nomeCategoria || 'Sem Categoria';
            categoriaMap[categoria] = (categoriaMap[categoria] || 0) + 1;
        });

        const estoquePorCategoria = Object.entries(categoriaMap).map(([name, value]) => ({
            name,
            value
        }));

        // Calcular valor arrecadado por mês
        const valorPorMes = this.calculateValorPorMes(reservas);

        // Taxa de retirada e desistência
        const totalReservas = reservas.length;
        const reservasRetiradas = reservas.filter(r => 
            r.statusReserva && r.statusReserva.toLowerCase().includes('retirad')
        ).length;
        const reservasNaoRetiradas = totalReservas - reservasRetiradas;

        const taxaRetirada = totalReservas > 0 ? ((reservasRetiradas / totalReservas) * 100).toFixed(0) : 0;
        const taxaDesistencia = totalReservas > 0 ? ((reservasNaoRetiradas / totalReservas) * 100).toFixed(0) : 0;

        // Tempo de permanência no catálogo
        const tempoCatalogo = this.calculateTempoCatalogo(livros);

        return {
            valorEstoque: valorEstoque.toFixed(2),
            conservacao: {
                excelente: percentExcelente,
                bom: percentBom,
                razoavel: percentRazoavel,
                degradado: percentDegradado
            },
            estoquePorCategoria,
            valorPorMes,
            taxaRetirada: parseInt(taxaRetirada),
            taxaDesistencia: parseInt(taxaDesistencia),
            totalReservas,
            reservasRetiradas,
            reservasNaoRetiradas,
            tempoCatalogo
        };
    },

    calculateValorPorMes(reservas) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const valorPorMes = meses.map(mes => ({ name: mes, valor: 0 }));

        reservas.forEach(reserva => {
            if (reserva.dtReserva && reserva.totalReserva) {
                try {
                    const data = new Date(reserva.dtReserva);
                    const mesIndex = data.getMonth();
                    if (mesIndex >= 0 && mesIndex < 12) {
                        valorPorMes[mesIndex].valor += reserva.totalReserva;
                    }
                } catch (error) {
                    console.warn('Erro ao processar data:', reserva.dtReserva);
                }
            }
        });

        return valorPorMes;
    },

    calculateTempoCatalogo(livros) {
        const hoje = new Date();
        
        const livrosComTempo = livros
            .map(livro => {
                if (!livro.dataAdicao) return null;
                
                const dataAdicao = new Date(livro.dataAdicao);
                const diffTime = Math.abs(hoje - dataAdicao);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return {
                    id: livro.id,
                    titulo: livro.titulo,
                    capa: livro.capa,
                    dias: diffDays
                };
            })
            .filter(livro => livro !== null)
            .sort((a, b) => b.dias - a.dias)
            .slice(0, 6);

        return livrosComTempo;
    }
};

export default dashboardService;