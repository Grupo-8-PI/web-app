import React, { useEffect, useState } from 'react';
import MiniCategorias from './MiniCategorias';
import api from '../services/api';
import '../StyleAej.css';

export default function MiniCategoriasList({ limit = 4, onCategoriaClick }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/categorias');
        const data = Array.isArray(res.data) ? res.data : [];
        if (mounted) setCategorias(data.slice(0, limit));
      } catch (err) {
        console.error('Erro ao carregar mini categorias:', err);
        if (mounted) setError('Não foi possível carregar categorias');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [limit]);

  if (loading) return <div>Carregando categorias...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <>
      {categorias.map((cat) => {
        const titulo = cat.nome || cat.titulo || cat.name || 'Categoria';
        const icone = cat.icone || cat.iconeEmoji || null;
        const iconNode = icone ? <span style={{ fontSize: '20px' }}>{icone}</span> : <i className='bx bxs-book-open mini-categoria-icon'></i>;
        return (
          <MiniCategorias
            key={cat.id || titulo}
            titulo={titulo}
            icon={iconNode}
            onClick={() => onCategoriaClick ? onCategoriaClick(cat) : null}
          />
        );
      })}
    </>
  );
}
