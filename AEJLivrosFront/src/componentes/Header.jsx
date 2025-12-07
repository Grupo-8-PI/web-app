import React, { useState, useRef } from 'react';  
import '../StyleAej.css'
import { Link } from 'react-router-dom';
import UserModal from './UserModal';
import BuscaModal from './BuscaModal';
import { useLivrosGlobal } from '../hooks/useLivrosGlobal';

export function Header() {
    const [showModal, setShowModal] = useState(false);
    const [showBuscaModal, setShowBuscaModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const userIconRef = useRef(null);
    const { buscarLivrosLocal } = useLivrosGlobal();

    const handleUserClick = () => {
        setShowModal((prev) => !prev);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        console.log('Search query:', query);
        
        if (query.trim().length > 0) {
            setShowBuscaModal(true);
            const resultados = buscarLivrosLocal(query);
            console.log('Resultados encontrados:', resultados);
            setSearchResults(resultados);
        } else {
            setShowBuscaModal(false);
            setSearchResults([]);
        }
    };

    const handleCloseBuscaModal = () => {
        setShowBuscaModal(false);
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
                <div className="searchBox" style={{ position: 'relative', width: '100%' }}>
                    <i className='bx bx-search-alt-2'></i>
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="searchInput"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <BuscaModal 
                        isOpen={showBuscaModal} 
                        onClose={handleCloseBuscaModal}
                        searchResults={searchResults}
                    />
                </div>
                <div className="icons" style={{ position: 'relative' }}>
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
