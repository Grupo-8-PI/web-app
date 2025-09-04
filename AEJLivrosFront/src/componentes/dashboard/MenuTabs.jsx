import "./MenuTabs.css";

const MenuTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { key: "Geral", label: "Geral" },
    { key: "Reservas", label: "Reservas" },
    { key: "Inconsistencias", label: "Inconsistências" },
    { key: "Visao-estante", label: "Visão Estante" },
  ];

  return (
    <div className="menu-tabs">
      <ul className="tabs-list">
        {tabs.map(({ key, label }) => (
          <li
            key={key}
            className={`tab-item ${activeTab === key ? "active" : ""}`}
            onClick={() => onChange(key)}
          >
            {label}
            {key === "Inconsistencias" && (
              <span className="tooltip">2</span>
            )}
            {key === "Reservas" && (
              <span className="tooltip">7</span>
            )}
          </li>
        ))}
      </ul>

      <div className="filter-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          stroke="white"
          width="18"
          height="18"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
      </div>
    </div>
  );
};

export default MenuTabs;
