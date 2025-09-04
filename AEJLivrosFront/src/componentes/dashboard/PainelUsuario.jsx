import React from "react";
import "./PainelUsuario.css";

const PainelUsuario = () => {
  return (
    <aside className="user-panel">
      <div className="user-info">
        <div className="user-avatar"><i className="bx bxs-user"></i></div>
        <h3 className="user-name">Usuário</h3>
        <p className="user-role">Administrador</p>
        <button className="client-mode-btn">Modo cliente</button>
      </div>

      <div className="user-stats">
        <div className="stat-box">
          <p className="stat-value">R$ 120,00</p>
          <p className="stat-label">Arrecadados</p>
        </div>
        <div className="stat-box">
          <p className="stat-value">+1180</p>
          <p className="stat-label">Clientes</p>
        </div>
      </div>
    </aside>
  );
};

export default PainelUsuario;
