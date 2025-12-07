import React from 'react';
import './cardLivro.css';

export default function CardLivro({ 
    id,
    titulo, 
    autor, 
    imagem, 
    preco, 
    ano, 
    categoria,
    conservacao,
    editora,
    paginas,
    onVerDetalhes 
}) {
    return (
        <div className="card-livro" onClick={onVerDetalhes}>
            <div className="imageEsp-container">
                {categoria && (
                    <div className="card-livro-badge">
                        {categoria}
                    </div>
                )}
                
                {imagem ? (
                    <img 
                        src={imagem}
                        alt={`Capa de ${titulo}`}
                        className="imageEsp"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                                <div class="mock-imagem">
                                    
                                    <span>Sem Capa</span>
                                </div>
                            `;
                        }}
                    />
                ) : (
                    <div className="mock-imagem">
                        
                        <span>Sem Capa</span>
                    </div>
                )}
            </div>

            <div className="especLivro">
                <h2 title={titulo}>
                    {titulo || 'Título não disponível'}
                </h2>

                {autor && (
                    <h4 title={autor}>
                        Por: {autor}
                    </h4>
                )}

                {ano && (
                    <p>
                        Ano: <span>{ano}</span>
                    </p>
                )}

                {paginas && (
                    <p>
                        Páginas: <span>{paginas}</span>
                    </p>
                )}

                {conservacao && (
                    <p>
                        Estado: <span>{conservacao}</span>
                    </p>
                )}

                {/* Preço */}
                <h3>
                    R$ {(preco || 0).toFixed(2)}
                </h3>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onVerDetalhes();
                    }}
                >
                    <i className='bx bx-book-open'></i>
                    Ver detalhes
                </button>
            </div>
        </div>
    );
}