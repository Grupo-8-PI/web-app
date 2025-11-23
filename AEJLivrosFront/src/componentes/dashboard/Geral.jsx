import { useState, useEffect } from "react";
import Cards from "./Cards";
import Charts from "./Charts";
import Charts2 from "./Charts2";
import TempoCatalogo from "./TempoCatalogo";
import dashboardService from "../../services/dashboardService";

const Geral = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar dados da dashboard:', err);
      setError('Não foi possível carregar os dados da dashboard. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
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
      <div className="cards">
        <Cards stats={stats} loading={loading} />
      </div>

      <div className="charts">
        <div className="top">
          <Charts stats={stats} loading={loading} />
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