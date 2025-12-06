import "./TempoCatalogo.css";

function TempoCatalogo({ stats, loading }) {
  if (loading) {
    return (
      <div className="tempo-catalogo">
        <h3>Tempo de permanência no catálogo</h3>
        <div className="livros-grid">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!stats || !stats.tempoCatalogo || stats.tempoCatalogo.length === 0) {
    return (
      <div className="tempo-catalogo">
        <h3>Tempo de permanência no catálogo</h3>
        <div className="livros-grid">
          <p>Nenhum livro encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tempo-catalogo">
      <h3>Tempo de permanência no catálogo</h3>
      <div className="livros-grid">
        {stats.tempoCatalogo.map((livro, index) => (
          <div key={livro.id} className="livro-item">
            <div className="livro-numero">{index + 1}.</div>
            <img 
              src={livro.capa || "https://via.placeholder.com/50x75?text=Sem+Capa"} 
              alt={livro.titulo} 
              className="livro-capa-mini"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/50x75?text=Sem+Capa";
              }}
            />
            <div className="livro-info">
              <span className="label">Tempo de permanência:</span>
              <p className="dias">{livro.dias} dias</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TempoCatalogo;