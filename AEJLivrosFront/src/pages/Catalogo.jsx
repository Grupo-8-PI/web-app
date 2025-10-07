
import CardLivro from "../componentes/CardLivro";
import FiltroCatalogo from "../componentes/FiltroCatalogo";
import ModalLivro from "../componentes/ModalLivro";
import { Header } from "../componentes/Header";
import "./cssPages/Catalogo.css";

import React, { useState } from 'react';

export default function Catalogo() {
    const [modalLivro, setModalLivro] = useState(null);
    const livros = [
        {
            categoria: "Ficção",
            titulo: "O Senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            imagem: "",
            preco: "49,90",
            ano: "1954",
            conservacao: "Ótimo"
        },
        {
            categoria: "Romance",
            titulo: "Orgulho e Preconceito",
            autor: "Jane Austen",
            imagem: "",
            preco: "39,90",
            ano: "1813",
            conservacao: "Bom"
        },
        {
            categoria: "Aventura",
            titulo: "A Ilha do Tesouro",
            autor: "R.L. Stevenson",
            imagem: "",
            preco: "29,90",
            ano: "1883",
            conservacao: "Usado"
        },
        {
            categoria: "Fantasia",
            titulo: "Harry Potter e a Pedra Filosofal",
            autor: "J.K. Rowling",
            imagem: "",
            preco: "59,90",
            ano: "1997",
            conservacao: "Novo"
        },
        {
            categoria: "Drama",
            titulo: "O Pequeno Príncipe",
            autor: "Antoine de Saint-Exupéry",
            imagem: "",
            preco: "34,90",
            ano: "1943",
            conservacao: "Ótimo"
        },
        {
            categoria: "Suspense",
            titulo: "O Código Da Vinci",
            autor: "Dan Brown",
            imagem: "",
            preco: "44,90",
            ano: "2003",
            conservacao: "Bom"
        },
        {
            categoria: "Biografia",
            titulo: "Steve Jobs",
            autor: "Walter Isaacson",
            imagem: "",
            preco: "54,90",
            ano: "2011",
            conservacao: "Ótimo"
        },
        {
            categoria: "História",
            titulo: "Sapiens: Uma Breve História da Humanidade",
            autor: "Yuval Noah Harari",
            imagem: "",
            preco: "64,90",
            ano: "2011",
            conservacao: "Novo"
        },
        {
            categoria: "Autoajuda",
            titulo: "O Poder do Hábito",
            autor: "Charles Duhigg",
            imagem: "",
            preco: "32,90",
            ano: "2012",
            conservacao: "Bom"
        }
    ];

    return (
        <div>
            <Header/>
            <div className="cat-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo />
                </div>
                <div className="catEsp">
                    {livros.map((livro, idx) => (
                        <CardLivro key={idx} {...livro} onVerDetalhes={() => setModalLivro(livro)} />
                    ))}
                </div>
            </div>
            <ModalLivro livro={modalLivro} onClose={() => setModalLivro(null)} />
        </div>
    );
}
