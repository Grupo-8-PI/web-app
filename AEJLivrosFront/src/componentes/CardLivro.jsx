import React from 'react';
import "./cardLivro.css";


const CardLivro = ({ categoria ,titulo, autor, imagem, preco, ano, conservacao, onVerDetalhes }) => {
    return (
        <div className="card-livro">    
        <div className="imageEsp">
            {imagem ? (
                <img src={imagem} alt={titulo} className="card-livro-imagem" />
            ) : (
                <div className="mock-imagem">
                    <i className='bx bx-image'></i>
                </div>
            )}
        </div>
            <div className="especLivro">
                <p>Livro<i className='bx bx-chevron-right'></i><span>{categoria}</span></p> 
                <h2 title={titulo}>{titulo}</h2>
                <h3>R$ {preco}</h3>
                <hr />
                <h4>Por: {autor}</h4>
                <h4>Ano: {ano}</h4>
                <h4>Conservação: {conservacao}</h4>
                <button onClick={onVerDetalhes}>Ver detalhes</button>
            </div>
        </div>
    );
};

export default CardLivro;