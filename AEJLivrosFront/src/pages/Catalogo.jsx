import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../services/api";
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

    const location = useLocation();

    const fetchLivros = async (pageNumber = 0) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(location.search);
            const categoriaId = params.get('categoria');

            let res;
            if (categoriaId) {
                res = await api.get(`/livros/categoria/${categoriaId}`);
            } else {
                res = await api.get('/livros', {
                    params: { page: pageNumber, size }
                });
            }

            const data = categoriaId 
                ? (Array.isArray(res.data) ? res.data : [])
                : (res.data.livros || res.data.items || res.data.data || []);
            const mapped = data.map(l => ({
                id: l.id || l._id,
                titulo: l.titulo || l.nome || l.title,
                autor: l.autor || l.autores || null,
                imagem: l.capa || l.imagem || l.cover || null,
                preco: l.preco,
                ano: l.anoPublicacao || l.ano || l.year,
                categoria: l.nomeCategoria || l.categoria || null,
                conservacao: l.estadoConservacao || l.conservacao || null,
                editora: l.editora,
                paginas: l.paginas,
                descricao: l.descricao || l.description || null
            }));

            setLivros(mapped);
            setPage(res.data.page || pageNumber); 
            setTotalPages(res.data.totalPages || 1); 
        } catch (err) {
            console.error('Erro ao carregar livros/catalogo:', err);
            setError('Não foi possível carregar os livros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLivros(0); 
    }, [location.search]);

    const handlePageChange = (newPage) => {
        fetchLivros(newPage);
    };

    return (
        <div>
            <Header />
            <div className="cat-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo />
                </div>
                <div className="catAll">
                    <div className="catEsp">
                        {loading && <div>Carregando livros...</div>}
                        {error && <div className="error-msg">{error}</div>}
                        {!loading && livros.map((livro) => (
                            <CardLivro key={livro.id} {...livro} onVerDetalhes={() => setModalLivro(livro)} />
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
