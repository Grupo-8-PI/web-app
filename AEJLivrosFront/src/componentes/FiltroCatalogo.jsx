import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './FiltroCatalogo.css';

export default function FiltroCatalogo() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        const data = Array.isArray(res.data) ? res.data : [];
        setCategorias(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    if (categoriaId) {
      navigate(`/catalogo?categoria=${categoriaId}`);
    } else {
      navigate('/catalogo');
    }
  };

  const params = new URLSearchParams(location.search);
  const categoriaAtual = params.get('categoria') || '';

  const handleLimparFiltros = () => {
    navigate('/catalogo');
  };

  return (
    <div className="filtro-catalogo">
      <h2>Filtros</h2>
      <div className="filtro-bloco">
        <span>Conservação</span>
        <label><input type="checkbox" /> Ruim</label>
        <label><input type="checkbox" /> Médio</label>
        <label><input type="checkbox" /> Bom</label>
        <label><input type="checkbox" /> Ótimo</label>
      </div>
      <div className="filtro-bloco">
        <span>Acabamento</span>
        <label><input type="checkbox" /> Capa Dura</label>
        <label><input type="checkbox" /> Capa Comum</label>
      </div>
      <div className="filtro-bloco">
        <span>Categoria</span>
        <select 
          value={categoriaAtual} 
          onChange={handleCategoriaChange}
          className="filtro-select"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome || cat.titulo || cat.name}
            </option>
          ))}
        </select>
      </div>
      <button className="filtro-limpar" onClick={handleLimparFiltros}>Limpar Filtros</button>
    </div>
  );
}
