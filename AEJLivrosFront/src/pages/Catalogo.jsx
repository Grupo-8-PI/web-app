
import CardLivro from "../componentes/CardLivro";
import FiltroCatalogo from "../componentes/FiltroCatalogo";
import ModalLivro from "../componentes/ModalLivro";
import { Header } from "../componentes/Header";
import "./cssPages/Catalogo.css";

// ...existing code...
import Paginacao from "../componentes/Paginacao";

import React, { useState, useEffect } from 'react';
import api from "../services/api";

export default function Catalogo() {
    const [modalLivro, setModalLivro] = useState(null);
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLivros = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/livros');
                const data = Array.isArray(res.data) ? res.data : [];
                // mapeia campos do backend para CardLivro
                const mapped = data.map(l => ({
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
            } catch {
                setError('Não foi possível carregar os livros');
            } finally {
                setLoading(false);
            }
        };
        fetchLivros();
    }, []);

    return (
        <div>
            <Header/>
            <div className="cat-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo />
                </div>
                <div className="catEsp">
                    {loading && <div>Carregando livros...</div>}
                    {error && <div className="error-msg">{error}</div>}
                    {!loading && livros.map((livro) => (
                        <CardLivro key={livro.id} {...livro} onVerDetalhes={() => setModalLivro(livro)} />
                    ))}
                    <div className="espPag">
                        <Paginacao />
                    </div>
                </div>
            </div>
            <ModalLivro livro={modalLivro} onClose={() => setModalLivro(null)} />
        </div>
    );
}
