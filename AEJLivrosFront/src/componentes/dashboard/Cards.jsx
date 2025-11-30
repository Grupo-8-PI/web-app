import "./Cards.css";

function Cards({ stats, loading }) {
  if (loading) {
    return (
      <div className="cards">
        <div className="card">Carregando...</div>
        <div className="card">Carregando...</div>
        <div className="card">Carregando...</div>
        <div className="card">Carregando...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="cards">
        <div className="card">Erro ao carregar dados</div>
      </div>
    );
  }

  return (
    <div className="cards">
      <div className="card">
        Conservação excelente
        <br />
        <b>{stats.conservacao.excelente}%</b>
      </div>
      <div className="card">
        Conservação boa
        <br />
        <b>{stats.conservacao.bom}%</b>
      </div>
      <div className="card">
        Conservação razoável
        <br />
        <b>{stats.conservacao.razoavel}%</b>
      </div>
      <div className="card">
        Conservação degradada
        <br />
        <b>{stats.conservacao.degradado}%</b>
      </div>
    </div>
  );
}

export default Cards;