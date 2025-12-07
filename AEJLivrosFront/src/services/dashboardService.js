import api from './api';
import { parseBackendDate, isToday, isPastDate } from '../utils/dateUtils';

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

    async getDashboardStats(filters = {}) {
        try {
            const livrosResponse = await this.getAllLivros(0, 1000);
            
            let livros = [];
            if (livrosResponse.livros && Array.isArray(livrosResponse.livros)) {
                livros = livrosResponse.livros;
            } else if (livrosResponse.content && Array.isArray(livrosResponse.content)) {
                livros = livrosResponse.content;
            } else if (Array.isArray(livrosResponse)) {
                livros = livrosResponse;
            }

            const reservasResponse = await this.getAllReservas(0, 1000);
            
            let reservas = [];
            if (reservasResponse.reservas && Array.isArray(reservasResponse.reservas)) {
                reservas = reservasResponse.reservas;
            } else if (reservasResponse.content && Array.isArray(reservasResponse.content)) {
                reservas = reservasResponse.content;
            } else if (Array.isArray(reservasResponse)) {
                reservas = reservasResponse;
            }

            // Aplicar filtros
            const livrosFiltrados = this.applyFilters(livros, filters);
            const reservasFiltradas = this.applyReservaFilters(reservas, filters);

            return this.calculateStats(livrosFiltrados, reservasFiltradas, filters);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    },

    applyFilters(livros, filters) {
        let filtered = [...livros];

        if (filters.categoria) {
            filtered = filtered.filter(livro => 
                livro.categoriaId === parseInt(filters.categoria)
            );
        }

        return filtered;
    },

    applyReservaFilters(reservas, filters) {
        let filtered = [...reservas];

        if (filters.mes !== null && filters.mes !== undefined) {
            filtered = filtered.filter(reserva => {
                if (!reserva.dtReserva) return false;
                const data = parseBackendDate(reserva.dtReserva);
                return data.getMonth() === filters.mes && 
                       data.getFullYear() === filters.ano;
            });
        } else if (filters.ano) {
            filtered = filtered.filter(reserva => {
                if (!reserva.dtReserva) return false;
                const data = parseBackendDate(reserva.dtReserva);
                return data.getFullYear() === filters.ano;
            });
        }

        return filtered;
    },

    calculateStats(livros, reservas, filters = {}) {
        const valorEstoque = livros.reduce((sum, livro) => sum + (livro.preco || 0), 0);

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

        const categoriaMap = {};
        livros.forEach(livro => {
            const categoria = livro.nomeCategoria || 'Sem Categoria';
            categoriaMap[categoria] = (categoriaMap[categoria] || 0) + 1;
        });

        const estoquePorCategoria = Object.entries(categoriaMap).map(([name, value]) => ({
            name,
            value
        }));

        const valorPorMes = this.calculateValorPorMes(reservas, filters);

        const totalReservas = reservas.length;
        const reservasRetiradas = reservas.filter(r => 
            r.statusReserva && r.statusReserva.toLowerCase().includes('retirad')
        ).length;
        const reservasNaoRetiradas = totalReservas - reservasRetiradas;

        const taxaRetirada = totalReservas > 0 ? ((reservasRetiradas / totalReservas) * 100).toFixed(0) : 0;
        const taxaDesistencia = totalReservas > 0 ? ((reservasNaoRetiradas / totalReservas) * 100).toFixed(0) : 0;

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
            tempoCatalogo,
            totalLivrosFiltrados: livros.length
        };
    },

    calculateValorPorMes(reservas, filters = {}) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const valorPorMes = meses.map(mes => ({ name: mes, valor: 0 }));

        reservas.forEach(reserva => {
            if (reserva.dtReserva && reserva.totalReserva) {
                try {
                    const data = parseBackendDate(reserva.dtReserva);
                    const mesIndex = data.getMonth();
                    
                    if (filters.mes !== null && filters.mes !== undefined) {
                        if (mesIndex === filters.mes) {
                            valorPorMes[mesIndex].valor += reserva.totalReserva;
                        }
                    } else {
                        if (mesIndex >= 0 && mesIndex < 12) {
                            valorPorMes[mesIndex].valor += reserva.totalReserva;
                        }
                    }
                } catch {
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
                
                const dataAdicao = parseBackendDate(livro.dataAdicao);
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