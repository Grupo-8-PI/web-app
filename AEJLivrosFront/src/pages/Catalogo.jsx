import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const [filtros, setFiltros] = useState({ categoria: '', conservacoes: [], acabamentos: [] });

    const location = useLocation();
    const navigate = useNavigate();
    const vindoDeReserva = location.state?.vindoDeReserva || false;

    const fetchLivros = async (pageNumber = 0, currentFiltros = filtros, forceBypassCache = false) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(location.search);
            const categoriaUrl = params.get('categoria');
            const categoriaFiltro = currentFiltros.categoria || categoriaUrl;

            const bypassParam = forceBypassCache ? { 'bypass-cache': 'true' } : {};
            let allLivros = [];
            let totalPagesFromApi = 0;

            // ✅ LÓGICA CORRIGIDA: Com filtros = buscar todos e paginar localmente
            // Sem filtros = usar paginação do servidor
            if (categoriaFiltro || currentFiltros.conservacoes.length > 0 || currentFiltros.acabamentos.length > 0) {
                // COM FILTROS: Buscar todos os livros
                if (categoriaFiltro) {
                    const data = await api.get(`/livros/categoria/${categoriaFiltro}`, { params: bypassParam });
                    allLivros = Array.isArray(data.data) ? data.data : [];
                } else if (currentFiltros.conservacoes.length > 0 || currentFiltros.acabamentos.length > 0) {
                    const promises = [];
                    
                    // Buscar por conservação se selecionado
                    if (currentFiltros.conservacoes.length > 0) {
                        currentFiltros.conservacoes.forEach(conservacaoId => {
                            promises.push(api.get(`/livros/conservacao/${conservacaoId}`, { params: bypassParam }));
                        });
                    }
                    
                    // Buscar por acabamento se selecionado
                    if (currentFiltros.acabamentos.length > 0) {
                        currentFiltros.acabamentos.forEach(acabamentoId => {
                            promises.push(api.get(`/livros/acabamento/${acabamentoId}`, { params: bypassParam }));
                        });
                    }
                    
                    const results = await Promise.all(promises);
                    const uniqueMap = new Map();
                    results
                        .flatMap(r => Array.isArray(r.data) ? r.data : [])
                        .forEach(livro => uniqueMap.set(livro.id, livro));
                    allLivros = Array.from(uniqueMap.values());
                }

                // ✅ Aplicar interseção de múltiplos filtros
                if (categoriaFiltro && currentFiltros.conservacoes.length > 0) {
                    allLivros = allLivros.filter(livro => 
                        currentFiltros.conservacoes.includes(livro.conservacaoId)
                    );
                }
                
                if (categoriaFiltro && currentFiltros.acabamentos.length > 0) {
                    allLivros = allLivros.filter(livro => 
                        currentFiltros.acabamentos.includes(livro.acabamentoId)
                    );
                }
                
                if (currentFiltros.conservacoes.length > 0 && currentFiltros.acabamentos.length > 0 && !categoriaFiltro) {
                    allLivros = allLivros.filter(livro => 
                        currentFiltros.conservacoes.includes(livro.conservacaoId) &&
                        currentFiltros.acabamentos.includes(livro.acabamentoId)
                    );
                }
            } else {
                // SEM FILTROS: Usar paginação do servidor
                const res = await livroService.listarLivros(pageNumber, size, { bypassCache: forceBypassCache });
                allLivros = Array.isArray(res.livros) ? res.livros : (Array.isArray(res.data) ? res.data : []);
                totalPagesFromApi = res.totalPages || 0;
            }

            // ✅ Filtrar livros sem reserva e mapear campos
            const mapped = allLivros
                .filter(l => !l.hasReserva)
                .map(l => ({
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

            // ✅ PAGINAÇÃO CONSISTENTE
            if (categoriaFiltro || currentFiltros.conservacoes.length > 0) {
                // COM FILTROS: paginar localmente
                const inicio = pageNumber * size;
                const fim = inicio + size;
                const livrosPaginados = mapped.slice(inicio, fim);
                
                setLivros(livrosPaginados);
                setPage(pageNumber);
                setTotalPages(Math.ceil(mapped.length / size));
            } else {
                // SEM FILTROS: usar paginação do servidor
                setLivros(mapped);
                setPage(pageNumber);
                setTotalPages(Math.max(totalPagesFromApi, Math.ceil(mapped.length / size)));
            }
        } catch (err) {
            console.error('Erro ao carregar livros/catalogo:', err);
            setError('Não foi possível carregar os livros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vindoDeReserva) {
            fetchLivros(0, filtros, true);
            navigate(window.location.pathname, { replace: true });
        } else {
            fetchLivros(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, vindoDeReserva]);

    // Aplicar filtro de categoria quando vindo da navegação
    useEffect(() => {
        if (location.state?.categoriaId) {
            setFiltros(prev => ({ ...prev, categoria: location.state.categoriaId }));
            // Limpar o state após aplicar o filtro
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // ✅ CORRIGIDO: Dispara fetchLivros quando filtros mudam (reseta para página 0)
    useEffect(() => {
        fetchLivros(0, filtros);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros.categoria, filtros.conservacoes, filtros.acabamentos]);

    const handlePageChange = (newPage) => {
        fetchLivros(newPage, filtros);
    };

    return (
        <div style={{position: 'fixed', width: '99%', minHeight: '100vh'}}>
            <Header />
            <div className="cat-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo filtros={filtros} onChangeFiltros={setFiltros}/>
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
                                onVerDetalhes={async () => {

                                    try {
                                        const res = await api.get(`/livros/${livro.id}`);
                                        setModalLivro(res.data);
                                    // eslint-disable-next-line no-unused-vars
                                    } catch (e) {
                                        setModalLivro(livro); 
                                    }
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
            <ModalLivro livro={modalLivro} onClose={() => setModalLivro(null)} onReservaSucesso={fetchLivros} />
        </div>
    );
}
