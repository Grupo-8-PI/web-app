import { useState } from "react";
import "./DashboardFilters.css";

function DashboardFilters({ onFilterChange, categorias, loading }) {
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [selectedAno, setSelectedAno] = useState(new Date().getFullYear());

  const meses = [
    { value: "", label: "Todos os meses" },
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];

  const anos = [];
  const anoAtual = new Date().getFullYear();
  for (let i = anoAtual; i >= anoAtual - 5; i--) {
    anos.push(i);
  }

  const handleCategoriaChange = (e) => {
    const value = e.target.value;
    setSelectedCategoria(value);
    notifyFilterChange(value, selectedMes, selectedAno);
  };

  const handleMesChange = (e) => {
    const value = e.target.value;
    setSelectedMes(value);
    notifyFilterChange(selectedCategoria, value, selectedAno);
  };

  const handleAnoChange = (e) => {
    const value = e.target.value;
    setSelectedAno(value);
    notifyFilterChange(selectedCategoria, selectedMes, value);
  };

  const notifyFilterChange = (categoria, mes, ano) => {
    if (onFilterChange) {
      onFilterChange({
        categoria: categoria || null,
        mes: mes !== "" ? parseInt(mes) : null,
        ano: parseInt(ano),
      });
    }
  };

  const handleLimparFiltros = () => {
    setSelectedCategoria("");
    setSelectedMes("");
    setSelectedAno(new Date().getFullYear());
    notifyFilterChange("", "", new Date().getFullYear());
  };

  return (
    <div className="dashboard-filters">
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="categoria-filter">📚 Categoria:</label>
          <select
            id="categoria-filter"
            value={selectedCategoria}
            onChange={handleCategoriaChange}
            disabled={loading}
            className="filter-select"
          >
            <option value="">Todas as categorias</option>
            {categorias && categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="mes-filter">📅 Mês:</label>
          <select
            id="mes-filter"
            value={selectedMes}
            onChange={handleMesChange}
            disabled={loading}
            className="filter-select"
          >
            {meses.map((mes) => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="ano-filter">📆 Ano:</label>
          <select
            id="ano-filter"
            value={selectedAno}
            onChange={handleAnoChange}
            disabled={loading}
            className="filter-select"
          >
            {anos.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLimparFiltros}
          disabled={loading}
          className="btn-limpar-filtros"
          title="Limpar todos os filtros"
        >
          🗑️ Limpar Filtros
        </button>
      </div>

      {(selectedCategoria || selectedMes !== "") && (
        <div className="filters-active">
          <span className="filter-label">Filtros ativos:</span>
          {selectedCategoria && (
            <span className="filter-tag">
              Categoria: {selectedCategoria}
              <button onClick={() => {
                setSelectedCategoria("");
                notifyFilterChange("", selectedMes, selectedAno);
              }}>×</button>
            </span>
          )}
          {selectedMes !== "" && (
            <span className="filter-tag">
              Mês: {meses[parseInt(selectedMes) + 1].label}
              <button onClick={() => {
                setSelectedMes("");
                notifyFilterChange(selectedCategoria, "", selectedAno);
              }}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardFilters;