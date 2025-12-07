import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "./UserModal.css";

const UserModal = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (visible) {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const user = authService.getUser();
        setUserName(user?.nome || "Usuário");
        setUserEmail(user?.email || "");
      }
    }
  }, [visible]);

  const handleLogout = () => {
    authService.logout();
    onClose();
  };

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  if (!visible) return null;

  return (
    <div className="user-modal">
      <div className="user-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <h3>Bem-vindo!</h3>
              <p className="user-name">{userName}</p>
              <p className="user-email">{userEmail}</p>
            </div>
            
            <div className="user-menu">
              <button 
                className="menu-item"
                onClick={() => handleNavigation("/minhas-reservas")}
              >
                <i className='bx bx-book-bookmark'></i>
                Minhas Reservas
              </button>
              
              <button 
                className="menu-item"
                onClick={() => handleNavigation("/configuracoes")}
              >
                <i className='bx bx-cog'></i>
                Configurações
              </button>
              
              <button 
                className="menu-item logout-btn"
                onClick={handleLogout}
              >
                <i className='bx bx-log-out'></i>
                Sair
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Usuário</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
              Faça login para acessar seus dados
            </p>
            <button
              className="login-btn"
              onClick={() => handleNavigation("/login")}
            >
              Ir para Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
