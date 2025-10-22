import React, { useEffect, useState } from "react";
import { Header } from "../componentes/Header"; 
import '../StyleAej.css';
import CategoriaCard from "../componentes/CategoriaCard";
import api from "../services/api";

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchCategorias = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/categorias');
                const data = Array.isArray(res.data) ? res.data : [];
                if (mounted) setCategorias(data);
            } catch (err) {
                console.error('Erro ao carregar categorias:', err);
                if (mounted) setError('Não foi possível carregar as categorias');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCategorias();

        return () => { mounted = false; };
    }, []);

    return (
        <div>
            <Header />
            <div className="catSpace2">
                <h2>Selecione uma categoria:</h2>

                {loading && <p>Carregando categorias...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="catGrid">
                    {(!loading && categorias.length === 0) && <p>Nenhuma categoria encontrada.</p>}

                    {categorias.map((cat) => {
                        const titulo = cat.nome || cat.titulo || cat.name || 'Categoria';
                        const icone = cat.icone || cat.iconeEmoji || '📚';
                        const alt = cat.descricao || titulo;
                        return (
                            <CategoriaCard key={cat.id || titulo} titulo={titulo} icone={icone} alt={alt} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
