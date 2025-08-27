import React, { useEffect } from "react";

import { Acessibilidade } from "../componentes/Acessibilidade";
import BoxBook from "../componentes/BoxBook";
import { Header } from "../componentes/Header";
import MiniCategorias from "../componentes/MiniCategorias";
import AejBook from "../assets/AejBook.png";

export default function Home() {
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
    return (
        <div>
            <Acessibilidade/>
            <session className="primeira">
                <Header/>
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
                        <BoxBook titulo="Harry Potter e a Pedra Filosofal" autor="J.K. Rowling" />
                        <BoxBook titulo="Saga Crepúsculo Eclipse" autor="Stephenie Meyer" />
                        <BoxBook titulo="Os Sete Maridos de Evelyn Hugo" autor="Taylor Jenkins Reid" />
                    </div>
                </div>
                <div className="cat">
                    <div className="cat-header">
                        <h2>Categorias</h2>
                        <span className="ver-todos">
                            Ver todos <i className='bx bx-chevron-right'></i>
                        </span>
                    </div>
                    <div className="catSpace">
                        <MiniCategorias titulo={'História'} icon={<i className='bx bxs-book-open mini-categoria-icon'></i>}/>
                        <MiniCategorias titulo={'Romance'} icon={<i className='bx bxs-heart mini-categoria-icon'></i>}/>
                        <MiniCategorias titulo={'Ficcção'} icon={<i className='bx bxs-invader mini-categoria-icon'></i>}/>
                        <MiniCategorias titulo={'Auto ajuda'} icon={<i className='bx bxs-donate-heart mini-categoria-icon'></i>}/>
                    </div>
                </div>
            </session>
            <session className="terceira">
                <div className="recent-header">
                    <h2>Recentemente adicionados</h2>
                </div>
                <div className="recentSpace">
                    <BoxBook titulo="A Biblioteca da Meia-Noite" autor="Matt Haig" />
                    <BoxBook titulo="O Conto da Aia" autor="Margaret Atwood" />
                    <BoxBook titulo="A Paciente Silenciosa" autor="Alex Michaelides" />
                </div>
            </session>
        </div>
    );
}
