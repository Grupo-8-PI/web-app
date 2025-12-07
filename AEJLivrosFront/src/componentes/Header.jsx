import React, { useState, useRef } from 'react';  
import '../StyleAej.css'
import { Link } from 'react-router-dom';
import UserModal from './UserModal';
import BuscaModal from './BuscaModal';
import livroService from '../services/livroService';

export function Header() {
    const [showModal, setShowModal] = useState(false);
    const [showBuscaModal, setShowBuscaModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const userIconRef = useRef(null);

    const handleUserClick = () => {
        setShowModal((prev) => !prev);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim().length > 0) {
            setShowBuscaModal(true);
            setIsSearching(true);
            
            try {
                const response = await livroService.buscar(query);
                const livros = response.livros || response.content || response || [];
                
                const normalizedResults = livros.map(l => ({
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
                
                setSearchResults(normalizedResults);
            } catch (error) {
                console.error('Erro ao buscar livros:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
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
