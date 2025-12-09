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
    const [filtros, setFiltros] = useState({ categoria: '', conservacoes: [] });

    const location = useLocation();
    const navigate = useNavigate();
    const vindoDeReserva = location.state?.vindoDeReserva || false;

    const fetchLivros = async (pageNumber = 0, currentFiltros = filtros, forceBypassCache = false) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(location.search);
            const categoriaUrl = params.get('categoria');

            let res;
            let allLivros = [];
            const categoriaFiltro = currentFiltros.categoria || categoriaUrl;

            const bypassParam = forceBypassCache ? { 'bypass-cache': 'true' } : {};

            if (categoriaFiltro) {
                const data = await api.get(`/livros/categoria/${categoriaFiltro}`, { params: bypassParam });
                allLivros = Array.isArray(data.data) ? data.data : [];
            } else if (currentFiltros.conservacoes.length > 0) {
                const promises = currentFiltros.conservacoes.map(conservacaoId => 
                    api.get(`/livros/conservacao/${conservacaoId}`, { params: bypassParam })
                );
                const results = await Promise.all(promises);
                const uniqueMap = new Map();
                results
                    .flatMap(r => Array.isArray(r.data) ? r.data : [])
                    .forEach(livro => uniqueMap.set(livro.id, livro));
                allLivros = Array.from(uniqueMap.values());
            } else {
                res = await livroService.listarLivros(pageNumber, size, { bypassCache: forceBypassCache });
                const data = res.livros || res.items || res.data || [];
                allLivros = Array.isArray(data) ? data : [];
            }

            if (categoriaFiltro && currentFiltros.conservacoes.length > 0) {
                allLivros = allLivros.filter(livro => 
                    currentFiltros.conservacoes.includes(livro.conservacaoId)
                );
            }


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

            setLivros(mapped);
            
            if (res?.data?.totalPages) {
                setPage(res.data.page || pageNumber);
                setTotalPages(res.data.totalPages);
            } else {
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

    useEffect(() => {
        if (vindoDeReserva) {
            fetchLivros(0, filtros, true);
            navigate(window.location.pathname, { replace: true });
        } else {
            fetchLivros(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, vindoDeReserva]);

    // Se filtro for limpo, busca todos os livros
    useEffect(() => {
        if (filtros.limpar) {
            setFiltros({ categoria: '', conservacoes: [] });
            fetchLivros(0, { categoria: '', conservacoes: [] });
        }
    }, [filtros.limpar]);
    // Aplicar filtro de categoria quando vindo da navegação
    useEffect(() => {
        if (location.state?.categoriaId) {
            setFiltros(prev => ({ ...prev, categoria: location.state.categoriaId }));
            // Limpar o state após aplicar o filtro
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (filtros.categoria || filtros.conservacoes.length > 0) {
            fetchLivros(0, filtros);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);

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
