import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserModal.css";

const UserModal = ({ visible, onClose }) => {
  const navigate = useNavigate();
  if (!visible) return null;
  return (
    <div className="user-modal">
      <div className="user-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Usuário</h3>
        {/* <ul>
          <li>Perfil</li>
          <li>Minhas Reservas</li>
          <li>Sair</li>
        </ul> */}
        <button
          className="login-btn"
          onClick={() => {
            onClose();
            navigate("/login");
          }}
          style={{ marginTop: "12px", width: "100%", padding: "15px", borderRadius: "6px", background: "#09386B", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Ir para Login
        </button>
      </div>
    </div>
  );
};

export default UserModal;
