import { useState } from "react";
import "./Tabela.css";

const Reservas = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const reservas = [
    {
      autor: "Cliente 1",
      titulo: "Uma Vida Pequena",
      data: "10/09/2025",
      faltam: "2 dias",
      quantidade: 1,
      status: "Ok",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/41B6dmnbL7S._SY445_SX342_.jpg",
          titulo: "Uma Vida Pequena",
          autor: "Hanya Yanagihara",
          ano: 2016,
          idioma: "Português",
          paginas: 784,
          conservacao: "Média",
          categoria: "Ficção",
          preco: 16.5,
        },
      ],
    },
    {
      autor: "Cliente 2",
      titulo: "Mistborn: O Império Final",
      data: "15/09/2025",
      faltam: "5 dias",
      quantidade: 1,
      status: "Ok",
      detalhes: [
        {
          capa: "https://uploads.coppermind.net/thumb/Mistborn.png/200px-Mistborn.png",
          titulo: "Mistborn: O Império Final",
          autor: "Brandon Sanderson",
          ano: 2020,
          idioma: "Português",
          paginas: 608,
          conservacao: "Nova",
          categoria: "Fantasia",
          preco: 25.0,
        },
      ],
    },
    {
      autor: "Cliente 3",
      titulo: "1984 + A Revolução dos Bichos",
      data: "12/09/2025",
      faltam: "3 dias",
      quantidade: 2,
      status: "Ok",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/51CIEO1yFnL._SY445_SX342_.jpg",
          titulo: "1984",
          autor: "George Orwell",
          ano: 1949,
          idioma: "Português",
          paginas: 416,
          conservacao: "Boa",
          categoria: "Distopia",
          preco: 32.9,
        },
        {
          capa: "https://m.media-amazon.com/images/I/91BsZhxCRjL._AC_UY327_FMwebp_QL65_.jpg",
          titulo: "A Revolução dos Bichos",
          autor: "George Orwell",
          ano: 1945,
          idioma: "Português",
          paginas: 152,
          conservacao: "Boa",
          categoria: "Fábula Política",
          preco: 18.5,
        },
      ],
    },
    {
      autor: "Cliente 4",
      titulo: "O Hobbit",
      data: "17/09/2025",
      faltam: "7 dias",
      quantidade: 1,
      status: "Ok",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/91M9xPIf10L._SY425_.jpg",
          titulo: "O Hobbit",
          autor: "J. R. R. Tolkien",
          ano: 1937,
          idioma: "Português",
          paginas: 320,
          conservacao: "Nova",
          categoria: "Fantasia",
          preco: 29.9,
        },
      ],
    },
    {
      autor: "Cliente 5",
      titulo: "Dom Casmurro",
      data: "09/09/2025",
      faltam: "1 dia",
      quantidade: 1,
      status: "Ok",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/61Z2bMhGicL._SY425_.jpg",
          titulo: "Dom Casmurro",
          autor: "Machado de Assis",
          ano: 1899,
          idioma: "Português",
          paginas: 288,
          conservacao: "Antigo",
          categoria: "Romance",
          preco: 18.7,
        },
      ],
    },
    {
      autor: "Cliente 6",
      titulo: "A Menina que Roubava Livros + O Diário de Anne Frank + Coraline",
      data: "20/09/2025",
      faltam: "10 dias",
      quantidade: 3,
      status: "Ok",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/61L+4OBhm-L._SY425_.jpg",
          titulo: "A Menina que Roubava Livros",
          autor: "Markus Zusak",
          ano: 2005,
          idioma: "Português",
          paginas: 480,
          conservacao: "Média",
          categoria: "Drama",
          preco: 34.5,
        },
        {
          capa: "https://m.media-amazon.com/images/I/91RMqWB-CTL._AC_UY327_FMwebp_QL65_.jpg",
          titulo: "O Diário de Anne Frank",
          autor: "Anne Frank",
          ano: 1947,
          idioma: "Português",
          paginas: 352,
          conservacao: "Boa",
          categoria: "Biografia",
          preco: 27.0,
        },
        {
          capa: "https://m.media-amazon.com/images/I/91DZobBc1BL._AC_UY327_FMwebp_QL65_.jpg",
          titulo: "Coraline",
          autor: "Neil Gaiman",
          ano: 2002,
          idioma: "Português",
          paginas: 176,
          conservacao: "Nova",
          categoria: "Fantasia Sombria",
          preco: 22.3,
        },
      ],
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Autor</th>
            <th>Título</th>
            <th>Data</th>
            <th>Faltam</th>
            <th>Quantidade</th>
            <th>Status de Aprovação</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva, index) => {
            const total = reserva.detalhes.reduce((acc, livro) => acc + livro.preco, 0);
            return (
              <>
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="autor-cell">
                      <i className="bx bx-user"></i>
                      <div className="autor-info">
                        <span className="autor-nome">{reserva.autor}</span>
                        <span className="sub">Requerente</span>
                      </div>
                    </div>
                  </td>
                  <td>{reserva.titulo}</td>
                  <td>{reserva.data}</td>
                  <td>{reserva.faltam}</td>
                  <td>{reserva.quantidade}</td>
                  <td>
                    <span className="status-badge status-ok">{reserva.status}</span>
                  </td>
                  <td>
                    <button
                      className={`arrow-btn ${expandedIndex === index ? "open" : ""}`}
                      onClick={() => toggleExpand(index)}
                    >
                      <i className="bx bx-chevron-down"></i>
                    </button>
                  </td>
                </tr>

                {expandedIndex === index && (
                  <tr className="detalhes-row">
                    <td colSpan="8">
                      <div className="detalhes-container">
                        {reserva.detalhes.map((livro, i) => (
                          <div key={i} className="detalhes-livro">
                            <img src={livro.capa} alt={`Capa de ${livro.titulo}`} className="detalhes-capa" />
                            <div className="detalhes-info">
                              <h3>{livro.titulo}</h3>
                              <p><strong>Autor:</strong> {livro.autor}</p>
                              <p><strong>Ano:</strong> {livro.ano}</p>
                              <p><strong>Idioma:</strong> {livro.idioma}</p>
                              <p><strong>Páginas:</strong> {livro.paginas}</p>
                              <p><strong>Conservação:</strong> {livro.conservacao}</p>
                              <p><strong>Categoria:</strong> {livro.categoria}</p>
                              <p className="reserva-total">Preço: R$ {livro.preco.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        <div className="detalhes-footer">
                          <p className="reserva-total"><strong>Total da Reserva:</strong> R$ {total.toFixed(2)}</p>
                          <div className="detalhes-botoes">
                            <button className="cancelar-btn">Cancelar Reserva</button>
                            <button className="concluir-btn">Concluir Reserva</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>

      <div className="tabela-pagination">
        <span>&lt;</span>
        <span>&gt;</span>
      </div>
    </div>
  );
};

export default Reservas;
