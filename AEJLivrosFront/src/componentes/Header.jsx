import React from 'react';  
import '../StyleAej.css'
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <div className="headerLanding">
            <div className="leftSpace">
                <div className="logo"></div>
                <div className="ops">
                
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/sobre">Sobre</Link></li>
                        <li><Link to="/categorias">Categorias</Link></li>
                        <li><Link to="/catalogo">Catálogo</Link></li>
                        <li><Link to="/minhas-reservas">Minhas Reservas</Link></li>
                    
                </div>
            </div>
            <div className="rightSpace">
                <div className="searchBox">
                    <i className='bx bx-search-alt-2'></i>
                    <input type="text" placeholder="Buscar..." className="searchInput" />
                </div>
                <div className="icons">
                    <i className='bx bxs-cart'></i>
                    <i className='bx bxs-user-circle user' ></i>
                </div>
            </div>
        </div>
    );
}
