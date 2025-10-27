import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import AejLogo from "../../assets/AejLivro.png";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
              onClick={() => handleTabChange("Geral")}
              className={activeTab === "Geral" ? "active" : ""}
              title="Visão Geral"
            >
              <i className="bx bxs-home icon"></i>
            </i>
          </li>
          
          <li>
            <i 
              onClick={() => handleTabChange("Reservas")}
              className={activeTab === "Reservas" ? "active" : ""}
              title="Reservas"
            >
              <i className="bx bxs-book icon"></i>
            </i>
          </li>
          
          <li>
            <i 
              onClick={() => handleTabChange("Visao-estante")}
              className={activeTab === "Visao-estante" ? "active" : ""}
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