
import React from "react";
import "../StyleAej.css";


const BoxBook = ({ imagem, titulo, autor, onVer }) => {
       return (
	       <div className="box-book-custom">
		       <div className="book-img-area">
			       {imagem ? (
				       <img src={imagem} alt={titulo} className="book-image-custom" />
			       ) : (
				       <svg className="book-placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
			       )}
		       </div>
		       <div className="book-info-custom">
			       <h3 className="book-title-custom">{titulo}</h3>
			       <span className="book-author-custom">{autor}</span>
			       <button className="book-btn-custom" onClick={onVer}>Ver</button>
		       </div>
	       </div>
       );
};

export default BoxBook;
