import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import AejLogo from "../../assets/AejLivro.png";

function Sidebar({ activeTab, setActiveTab, mode = "auto" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta automaticamente se está em modo tabs ou routes
  const isTabMode = mode === "tabs" || (mode === "auto" && setActiveTab !== undefined);
  const isRouteMode = mode === "routes" || (mode === "auto" && !setActiveTab);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Função unificada para lidar com cliques
  const handleItemClick = (tab) => {
    if (isTabMode) {
      // Modo tabs: muda a tab dentro da Dashboard
      setActiveTab(tab);
    } else {
      // Modo routes: navega para /dashboard com state indicando a tab
      navigate('/dashboard', { state: { activeTab: tab } });
    }
  };

  // Verifica se um item está ativo
  const isActive = (tab) => {
    if (isTabMode) {
      return activeTab === tab;
    } else {
      // No modo routes, verifica se está na dashboard e compara com a última tab conhecida
      return location.pathname === '/dashboard';
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-header">
        <img src={AejLogo} alt="AEJ Livros Logo" />
      </div>
      <nav>
        <ul>
          <li>
            <i 
              onClick={() => handleItemClick("Geral")}
              className={isActive("Geral") ? "active" : ""}
              title="Visão Geral"
            >
              <i className="bx bxs-home icon"></i>
            </i>
          </li>
          
          <li>
            <i 
              onClick={() => handleItemClick("Reservas")}
              className={isActive("Reservas") ? "active" : ""}
              title="Reservas"
            >
              <i className="bx bxs-book icon"></i>
            </i>
          </li>
          
          <li>
            <i 
              onClick={() => handleItemClick("Visao-estante")}
              className={isActive("Visao-estante") ? "active" : ""}
              title="Visão Estante"
            >
              <i className="bx bx-show icon"></i>
            </i>
          </li>
          
          <li>
            <i 
              onClick={handleLogout} 
              className="logout-btn"
              title="Sair"
            >
              <i className="bx bx-log-out icon"></i>
            </i>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;