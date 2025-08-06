import React from 'react';  
import '../StyleAej.css'

export function Header() {
  return (
    <div className="headerLanding">
        <div className="leftSpace">
            <div className="logo"></div>
            <div className="ops">
                <li>Inicio</li>
                <li>Sobre</li>
                <li>Categorias</li>
                <li>Catálogo</li>
                <li>Minhas Reservas</li>
            </div>
        </div>
        <div className="rightSpace">
            <div className="searchBox">
                <i className='bx bx-search-alt-2'></i>
                <input type="text" placeholder="Buscar..." className="searchInput" />
            </div>
        </div>
    </div>
  );
}
