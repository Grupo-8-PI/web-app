import { useState, useEffect } from "react";
import Cards from "./Cards";
import Charts from "./Charts";
import Charts2 from "./Charts2";
import TempoCatalogo from "./TempoCatalogo";
import DashboardFilters from "./DashboardFilters";
import dashboardService from "../../services/dashboardService";

const Geral = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filters, setFilters] = useState({
    categoria: null,
    mes: null,
    ano: new Date().getFullYear()
  });

  useEffect(() => {
    loadCategorias();
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadCategorias = async () => {
    try {
      const categoriasData = await dashboardService.getCategorias();
      setCategorias(categoriasData);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar dados da dashboard:', err);
      setError('Não foi possível carregar os dados da dashboard. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#d32f2f' }}>Erro ao Carregar Dashboard</h3>
        <p>{error}</p>
        <button 
          onClick={loadDashboardData}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#09386B',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <DashboardFilters 
        onFilterChange={handleFilterChange}
        categorias={categorias}
        loading={loading}
      />

      {stats && stats.totalLivrosFiltrados !== undefined && (
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '6px', 
          marginBottom: '15px',
          fontSize: '14px',
          color: '#09386B',
          fontWeight: '500'
        }}>
            Exibindo dados de <strong>{stats.totalLivrosFiltrados}</strong> livro(s)
          {filters.categoria && <span> da categoria <strong>{categorias.find(c => c.id === parseInt(filters.categoria))?.nome || filters.categoria}</strong></span>}
          {filters.mes !== null && <span> do mês filtrado</span>}
        </div>
      )}

      <div className="cards">
        <Cards stats={stats} loading={loading} />
      </div>

      <div className="charts">
        <div className="top">
          <Charts stats={stats} loading={loading} filters={filters} />
        </div>
        <div className="bottom">
          <Charts2 stats={stats} loading={loading} />
          <TempoCatalogo stats={stats} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default Geral;