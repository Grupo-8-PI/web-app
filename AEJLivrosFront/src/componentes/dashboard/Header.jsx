import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h2>Dashboard</h2>
      <input type="text" placeholder="Pesquisar..." />
      <button className="btn">+ Cadastrar Livro</button>
      <span className="bell">🔔</span>
    </header>
  );
}

export default Header;
