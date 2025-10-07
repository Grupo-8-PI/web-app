import React from 'react';
import './FiltroCatalogo.css';

export default function FiltroCatalogo({ onLimparFiltros }) {
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
        <select defaultValue="" className="filtro-select">
          <option value="" disabled>Selecione uma categoria</option>
          <option value="ficcao">Ficção</option>
          <option value="romance">Romance</option>
          <option value="aventura">Aventura</option>
          <option value="fantasia">Fantasia</option>
        </select>
      </div>
      <button className="filtro-limpar" onClick={onLimparFiltros}>Limpar Filtros</button>
    </div>
  );
}
