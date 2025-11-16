import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import AejLogo from "../../assets/AejLivro.png";

function Sidebar({ activeTab, setActiveTab, mode = "auto" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isTabMode = mode === "tabs" || (mode === "auto" && setActiveTab !== undefined);
  const isRouteMode = mode === "routes" || (mode === "auto" && !setActiveTab);

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    navigate('/');
  };

  const handleItemClick = (tab) => {
    if (isTabMode) {
      setActiveTab(tab);
    } else {
      navigate('/dashboard', { state: { activeTab: tab } });
    }
  };

  const handleConfigClick = () => {
    navigate('/configuracoes');
  };

  const isActive = (tab) => {
    if (isTabMode) {
      return activeTab === tab;
    } else {
      return location.pathname === '/dashboard';
    }
  };

  const isConfigActive = () => {
    return location.pathname === '/configuracoes';
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
              onClick={handleConfigClick}
              className={isConfigActive() ? "active" : ""}
              title="Configurações"
            >
              <i className="bx bxs-cog icon"></i>
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