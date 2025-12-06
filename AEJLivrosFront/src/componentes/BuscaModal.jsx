import { useState, useEffect } from 'react';
import './buscaModal.css';

export default function BuscaModal({ isOpen, onClose, searchResults }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (searchResults) {
      setBooks(searchResults);
    }
  }, [searchResults]);

  if (!isOpen) return null;

  const handleViewBook = (bookId) => {
    console.log('Visualizar livro:', bookId);
  };

  return (
    <div className="busca-modal-content">
        <button className="busca-modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="busca-modal-container">
          {books && books.length > 0 ? (
            <div className="busca-modal-books-list">
              {books.map((book, index) => (
                <div key={index} className="busca-modal-book-item">
                  <img 
                    src={book.capa || '/default-book.png'} 
                    alt={book.titulo} 
                    className="busca-modal-book-image"
                  />
                  <div className="busca-modal-book-info">
                    <h3 className="busca-modal-book-title">{book.titulo}</h3>
                    <p className="busca-modal-book-author">{book.autor}</p>
                    <button 
                      className="busca-modal-btn-ver"
                      onClick={() => handleViewBook(book.id)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="busca-modal-empty">
              <p>Nenhum livro encontrado</p>
            </div>
          )}
        </div>
    </div>
  );
}
