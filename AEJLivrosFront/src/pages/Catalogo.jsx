import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../services/api";
import livroService from "../services/livroService";
import CardLivro from "../componentes/CardLivro";
import FiltroCatalogo from "../componentes/FiltroCatalogo";
import ModalLivro from "../componentes/ModalLivro";
import Paginacao from "../componentes/Paginacao";
import { Header } from "../componentes/Header";
import "./cssPages/Catalogo.css";

export default function Catalogo() {
    const [modalLivro, setModalLivro] = useState(null);
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(9);
    const [totalPages, setTotalPages] = useState(0);
    const [filtros, setFiltros] = useState({ categoria: '', conservacoes: [] });

    const location = useLocation();

    const fetchLivros = async (pageNumber = 0, currentFiltros = filtros) => {
        console.log('CATALOGO fetchLivros called');
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(location.search);
            const categoriaUrl = params.get('categoria');

            let res;
            let allLivros = [];

            // Prioridade: filtros do componente > URL params
            const categoriaFiltro = currentFiltros.categoria || categoriaUrl;

            if (categoriaFiltro) {
                // Buscar por categoria
                const data = await livroService.buscarPorCategoria(categoriaFiltro);
                allLivros = Array.isArray(data) ? data : [];
            } else if (currentFiltros.conservacoes.length > 0) {
                // Buscar por conservações e combinar resultados
                const promises = currentFiltros.conservacoes.map(conservacaoId => 
                    livroService.buscarPorConservacao(conservacaoId)
                );
                const results = await Promise.all(promises);
                // Flatten e remover duplicatas
                const combined = results.flat();
                const uniqueMap = new Map();
                combined.forEach(livro => uniqueMap.set(livro.id, livro));
                allLivros = Array.from(uniqueMap.values());
            } else {
                // Buscar todos os livros
                res = await api.get('/livros', {
                    params: { page: pageNumber, size }
                });
                const data = res.data.livros || res.data.items || res.data.data || [];
                allLivros = Array.isArray(data) ? data : [];
            }

            // Se tem ambos os filtros, aplicar interseção
            if (categoriaFiltro && currentFiltros.conservacoes.length > 0) {
                allLivros = allLivros.filter(livro => 
                    currentFiltros.conservacoes.includes(livro.conservacaoId)
                );
            }

            const mapped = allLivros.map(l => ({
                id: l.id,
                titulo: l.titulo,
                autor: l.autor,
                imagem: l.capa || l.imagem || null,
                preco: l.preco,
                ano: l.anoPublicacao || l.ano,
                categoria: l.nomeCategoria || l.categoria || null,
                conservacao: l.estadoConservacao || l.conservacao || null,
                editora: l.editora,
                paginas: l.paginas,
                descricao: l.descricao || null
            }));

            console.log('CATALOGO mapped livros:', mapped.length, mapped[0]);
            setLivros(mapped);
            
            // Se temos dados de paginação da API, usar; senão calcular manualmente
            if (res?.data?.totalPages) {
                setPage(res.data.page || pageNumber);
                setTotalPages(res.data.totalPages);
            } else {
                // Para filtros (categoria/conservacao), calcular total de páginas
                setPage(pageNumber);
                setTotalPages(Math.ceil(mapped.length / size));
            }
        } catch (err) {
            console.error('Erro ao carregar livros/catalogo:', err);
            setError('Não foi possível carregar os livros');
        } finally {
            setLoading(false);
        }
    };

    // Carregar livros quando mudar a URL
    useEffect(() => {
        fetchLivros(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    // Aplicar filtro de categoria quando vindo da navegação
    useEffect(() => {
        if (location.state?.categoriaId) {
            setFiltros(prev => ({ ...prev, categoria: location.state.categoriaId }));
            // Limpar o state após aplicar o filtro
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Carregar livros quando mudar os filtros
    useEffect(() => {
        if (filtros.categoria || filtros.conservacoes.length > 0) {
            fetchLivros(0, filtros);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);

    const handleFilterChange = (newFiltros) => {
        setFiltros(newFiltros);
        setPage(0);
    };

    const handleLimparFiltros = () => {
        setFiltros({ categoria: '', conservacoes: [] });
        fetchLivros(0, { categoria: '', conservacoes: [] });
    };

    const handlePageChange = (newPage) => {
        fetchLivros(newPage, filtros);
    };

    return (
        <div>
            <Header />
            <div className="cat-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo 
                        onFilterChange={handleFilterChange}
                        onLimparFiltros={handleLimparFiltros}
                    />
                </div>
                <div className="catAll">
                    <div className="catEsp">
                        {loading && <div>Carregando livros...</div>}
                        {error && <div className="error-msg">{error}</div>}
                        {!loading && livros.length === 0 && <div>Nenhum livro encontrado</div>}
                        {!loading && livros.map((livro) => (
                            <CardLivro
                                key={livro.id}
                                titulo={livro.titulo}
                                autor={livro.autor}
                                imagem={livro.imagem}
                                preco={livro.preco}
                                ano={livro.ano}
                                categoria={livro.categoria}
                                conservacao={livro.conservacao}
                                paginas={livro.paginas}
                                onVerDetalhes={() => {
                                    console.log('CATALOGO setting modalLivro:', livro);
                                    setModalLivro(livro);
                                }}
                            />
                        ))}
                    </div>
                    <div className="espPag">
                        <Paginacao
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
            <ModalLivro livro={modalLivro} onClose={() => setModalLivro(null)} />
        </div>
    );
}
