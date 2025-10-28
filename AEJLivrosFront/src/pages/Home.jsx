import React, { useEffect, useState } from "react";
import "../StyleAej.css";
import { Acessibilidade } from "../componentes/Acessibilidade";
import BoxBook from "../componentes/BoxBook";
import ModalLivro from "../componentes/ModalLivro";
import api from "../services/api";
import { Header } from "../componentes/Header";
import MiniCategorias from "../componentes/MiniCategorias";
import MiniCategoriasList from "../componentes/MiniCategoriasList";
import AejBook from "../assets/AejBook.png";
import { Footer } from "../componentes/Footer";
import { Depoimentos } from "../componentes/Depoimentos";
import { Link } from "react-router-dom";

export default function Home() {
    const [recomendados, setRecomendados] = useState([]);
    const [recentes, setRecentes] = useState([]);
    const [loadingRec, setLoadingRec] = useState(false);
    const [recError, setRecError] = useState(null);
    const [selectedLivro, setSelectedLivro] = useState(null);
    useEffect(() => {
        const revealOnScroll = () => {
            const elements = document.querySelectorAll(".primeira, .segunda, .recomend, .cat, section");
            const windowHeight = window.innerHeight;
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < windowHeight - 80) {
                    el.classList.add("visible");
                } else {
                    el.classList.remove("visible");
                }
            });
        };
        window.addEventListener("scroll", revealOnScroll);
        revealOnScroll();
        return () => window.removeEventListener("scroll", revealOnScroll);
    }, []);

    useEffect(() => {
        const fetchRecomendados = async () => {
            setLoadingRec(true);
            setRecError(null);
            try {
                const res = await api.get('/livros/recomendados');
                // assume response data is an array of livros
                // map backend fields to the ones ModalLivro expects
                const data = Array.isArray(res.data) ? res.data : [];
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
                setRecomendados(mapped);
            } catch (err) {
                console.error('Erro ao buscar recomendados', err);
                setRecError('Não foi possível carregar recomendações');
            } finally {
                setLoadingRec(false);
            }
        };
        fetchRecomendados();
    }, []);
       useEffect(() => {
        const fetchRecentes = async () => {
            setLoadingRec(true);
            setRecError(null);
            try {
                const res = await api.get('/livros/recentes');
                const data = Array.isArray(res.data) ? res.data : [];
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
                setRecentes(mapped);
            } catch (err) {
                console.error('Erro ao buscar recentes', err);
                setRecError('Não foi possível carregar recentes');
            } finally {
                setLoadingRec(false);
            }
        };
        fetchRecentes();
    }, []);
    return (
        <div>
            <Acessibilidade />
            <session className="primeira">
                <Header />
                <div className="hero-area">
                    <div className="hero-content">
                        <h1>Seu novo livro</h1>
                        <h3>Pode ajudar muitas pessoas</h3>
                        <button className="hero-btn">Explore</button>
                    </div>
                    <div className="hero-3d-container">
                        <div className="hero-3d-concave">
                            <img src={AejBook} alt="Livro AEJ" className="hero-3d-img" />
                        </div>
                    </div>
                </div>
            </session>
            <session className="segunda">
                <div className="recomend">
                    <h2>Recomendações</h2>
                        <div className="recSpace">
                            {loadingRec && <div>Carregando recomendações...</div>}
                            {recError && <div className="error-msg">{recError}</div>}
                            {!loadingRec && recomendados.map((livro) => (
                                <BoxBook
                                    key={livro.id}
                                    titulo={livro.titulo}
                                    autor={livro.autor}
                                    imagem={livro.imagem}
                                    onVer={() => setSelectedLivro(livro)}
                                />
                            ))}
                        </div>
                        {selectedLivro && (
                            <ModalLivro livro={selectedLivro} onClose={() => setSelectedLivro(null)} />
                        )}
                </div>
                <div className="cat">
                    <div className="cat-header">
                        <h2>Categorias</h2>
                        <Link to="/categorias"><span className="ver-todos">
                            Ver todos <i className='bx bx-chevron-right'></i>
                            </span>
                        </Link>
                    </div>
                    <div className="catSpace">
                        <MiniCategoriasList />
                    </div>
                </div>
            </session>
            <session className="terceira">
                <div className="recent-header">
                    <h2>Recentemente adicionados</h2>
                </div>
                <div className="recentSpace">
                      {loadingRec && <div>Carregando recentes...</div>}
                            {recError && <div className="error-msg">{recError}</div>}
                            {!loadingRec && recentes.map((livro) => (
                                <BoxBook
                                    key={livro.id}
                                    titulo={livro.titulo}
                                    autor={livro.autor}
                                    imagem={livro.imagem}
                                    onVer={() => setSelectedLivro(livro)}
                                />
                            ))}

                              {selectedLivro && (
                            <ModalLivro livro={selectedLivro} onClose={() => setSelectedLivro(null)} />
                        )}
                </div>
            </session>
            <session className="servicos">
                <h2>Serviços</h2>
                <div className="comportMiniServ">
                    <MiniCategorias titulo={'Reservas de livros'} icon={<i className='bx bxs-bookmark-star   mini-categoria-icon'></i>} />
                    <MiniCategorias titulo={'Geração de sinopse com IA'} icon={<i className='bx bx-code-alt mini-categoria-icon'></i>} />
                    <MiniCategorias titulo={'Sistema de notificações'} icon={<i className='bx bxs-bell mini-categoria-icon'></i>} />
                    <MiniCategorias titulo={'Acessibilidade'} icon={<i className='bx bx-body mini-categoria-icon'></i>} />
                </div>
            </session>
            <session className="depoimentos">
                <h2>Depoimentos dos nossos clientes</h2>
                <div className="depSpace">
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                </div>
                <div className="depSpace">
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                    <Depoimentos />
                </div>
            </session>
            <session className="footerSection">
                <Footer />
            </session>
        </div>
    );
}
