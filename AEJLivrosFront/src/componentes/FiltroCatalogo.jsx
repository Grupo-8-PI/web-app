import React, { useState, useEffect } from 'react';
import './FiltroCatalogo.css';
import livroService from '../services/livroService';

export default function FiltroCatalogo({ onFilterChange, onLimparFiltros }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [conservacoesSelecionadas, setConservacoesSelecionadas] = useState([]);

  // Carregar categorias apenas uma vez
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const data = await livroService.listarCategorias();
        console.log('Categorias carregadas:', data);
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    carregarCategorias();
  }, []);

  // Notificar mudanças de filtro ao componente pai
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categoria: categoriaSelecionada,
        conservacoes: conservacoesSelecionadas
      });
    }
  }, [categoriaSelecionada, conservacoesSelecionadas, onFilterChange]);

  const handleConservacaoChange = (conservacaoId) => {
    setConservacoesSelecionadas(prev => {
      if (prev.includes(conservacaoId)) {
        return prev.filter(id => id !== conservacaoId);
      } else {
        return [...prev, conservacaoId];
      }
    });
  };

  const handleLimparFiltros = () => {
    setCategoriaSelecionada('');
    setConservacoesSelecionadas([]);
    if (onLimparFiltros) {
      onLimparFiltros();
    }
  };

  return (
    <div className="filtro-catalogo">
      <h2>Filtros</h2>
      
      <div className="filtro-bloco">
        <span>Conservação</span>
        <label>
          <input 
            type="checkbox" 
            checked={conservacoesSelecionadas.includes(1)}
            onChange={() => handleConservacaoChange(1)}
          /> Ruim
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={conservacoesSelecionadas.includes(2)}
            onChange={() => handleConservacaoChange(2)}
          /> Bom
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={conservacoesSelecionadas.includes(3)}
            onChange={() => handleConservacaoChange(3)}
          /> Muito Bom
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={conservacoesSelecionadas.includes(4)}
            onChange={() => handleConservacaoChange(4)}
          /> Ótimo
        </label>
      </div>

      <div className="filtro-bloco">
        <span>Categoria</span>
        <select 
          value={categoriaSelecionada} 
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
          className="filtro-select"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <button className="filtro-limpar" onClick={handleLimparFiltros}>
        Limpar Filtros
      </button>
    </div>
  );
}
