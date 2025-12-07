
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FiltroCatalogo.css';

const CONSERVACOES = [
  { id: 1, label: 'Excelente' },
  { id: 2, label: 'Bom' },
  { id: 3, label: 'Razoável' },
  { id: 4, label: 'Degradado' }
];


export default function FiltroCatalogo({ onChangeFiltros, filtros }) {
  const [categorias, setCategorias] = useState([]);
  const [conservacoesSelecionadas, setConservacoesSelecionadas] = useState(filtros?.conservacoes || []);

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

  useEffect(() => {
    const fetchLivrosPorConservacao = async () => {
      if (conservacoesSelecionadas.length === 0) {
        if (onChangeFiltros) {
          onChangeFiltros({ ...filtros, conservacoes: [] });
        }
        return;
      }
      try {
        const promises = conservacoesSelecionadas.map(id =>
          api.get(`/livros/conservacao/${id}`)
        );
        const results = await Promise.all(promises);
        const livros = results.flatMap(res => Array.isArray(res.data) ? res.data : []);
        const uniqueMap = new Map();
        livros.forEach(livro => uniqueMap.set(livro.id, livro));
        const livrosUnicos = Array.from(uniqueMap.values());
        if (onChangeFiltros) {
          onChangeFiltros({ ...filtros, conservacoes: conservacoesSelecionadas, livrosFiltrados: livrosUnicos });
        }
      } catch (err) {
        console.error('Erro ao buscar livros por conservação:', err);
      }
    };
    fetchLivrosPorConservacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conservacoesSelecionadas]);

  const handleConservacaoChange = (id) => {
    setConservacoesSelecionadas(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    if (onChangeFiltros) {
      onChangeFiltros({
        ...filtros,
        categoria: categoriaId
      });
    }
  };

  const categoriaAtual = filtros?.categoria || '';

  const handleLimparFiltros = () => {
    setConservacoesSelecionadas([]);
    if (onChangeFiltros) {
      onChangeFiltros({ categoria: '', conservacoes: [], limpar: true });
    }
  };

  return (
    <div className="filtro-catalogo">
      <h2>Filtros</h2>
      <div className="filtro-bloco">
        <span>Conservação</span>
        {CONSERVACOES.map(cons => (
          <label key={cons.id}>
            <input
              type="checkbox"
              checked={conservacoesSelecionadas.includes(cons.id)}
              onChange={() => handleConservacaoChange(cons.id)}
            />
            {cons.label}
          </label>
        ))}
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
      <div className="filtro-limpar-container">
        <button className="filtro-limpar" onClick={handleLimparFiltros}>Limpar Filtros</button>
      </div>
    </div>
  );
}
