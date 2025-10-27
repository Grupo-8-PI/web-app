
import CardLivro from "../componentes/CardLivro";
import FiltroCatalogo from "../componentes/FiltroCatalogo";
import ModalLivro from "../componentes/ModalLivro";
import { Header } from "../componentes/Header";
import "./cssPages/Catalogo.css";

// ...existing code...
import Paginacao from "../componentes/Paginacao";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../services/api";

export default function Catalogo() {
    const [modalLivro, setModalLivro] = useState(null);
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const fetchLivros = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams(location.search);
                const categoriaId = params.get('categoria');
                let res;
                if (categoriaId) {
                    // buscar livros pela categoria
                    res = await api.get(`/categorias/${categoriaId}`);
                } else {
                    res = await api.get('/livros');
                }

                let data = [];
                if (Array.isArray(res.data)) data = res.data;
                else if (Array.isArray(res.data.livros)) data = res.data.livros;
                else if (Array.isArray(res.data.items)) data = res.data.items;
                else if (Array.isArray(res.data.data)) data = res.data.data;
                else data = [];

                // mapeia campos do backend para CardLivro
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
            } catch (err) {
                console.error('Erro ao carregar livros/catalogo:', err);
                setError('Não foi possível carregar os livros');
            } finally {
                setLoading(false);
            }
        };
        fetchLivros();
    }, [location.search]);

    return (
        <div>
            <Header/>
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
                        <Paginacao />
                    </div>
                </div>
            </div>
            <ModalLivro livro={modalLivro} onClose={() => setModalLivro(null)} />
        </div>
    );
}
