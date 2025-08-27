import React from "react";
import "../StyleAej.css";

const MiniCategorias = ({ titulo, onClick, icon }) => {
  return (
    <div className="mini-categoria-base" onClick={onClick}>
      <div className="mini-categoria-icon-box">
        {icon}
      </div>
      <div className="mini-categoria-info">
        <span className="mini-categoria-title">{titulo}</span>
        <i className='bx bx-chevron-right mini-categoria-chevron'></i>
      </div>
    </div>
  );
};

export default MiniCategorias;
