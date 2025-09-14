import React, { useState, useRef } from 'react';  
import '../StyleAej.css'
import { Link } from 'react-router-dom';
import UserModal from './UserModal';

export function Header() {
    const [showModal, setShowModal] = useState(false);
    const userIconRef = useRef(null);

    const handleUserClick = () => {
        setShowModal((prev) => !prev);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="headerLanding" style={{ position: 'relative' }}>
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
                <div className="icons" style={{ position: 'relative' }}>
                    <i className='bx bxs-cart'></i>
                    <i
                        className='bx bxs-user-circle user'
                        ref={userIconRef}
                        onClick={handleUserClick}
                        style={{ cursor: 'pointer' }}
                    ></i>
                    <UserModal visible={showModal} onClose={handleCloseModal} />
                </div>
            </div>
        </div>
    );
}
