import { useState } from "react";
import "./Tabela.css";

const Inconsistencias = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const dados = [
    {
      autor: "Cliente 1",
      role: "Requerente",
      titulo: "O Sol é Para Todos",
      data: "10/08/2025",
      faltam: "-10 dias",
      quantidade: 1,
      status: "Inconsistente",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/51wdOrz6uNL._SY445_SX342_ControlCacheEqualizer_.jpg",
          titulo: "O Sol é Para Todos",
          autor: "Harper Lee",
          ano: 1960,
          idioma: "Português",
          paginas: 364,
          categoria: "Romance",
          dataLimite: "30/08/2025",
          preco: 24.9
        }
      ]
    },
    {
      autor: "Cliente 2",
      role: "Requerente",
      titulo: "O Conto da Aia",
      data: "15/07/2025",
      faltam: "-30 dias",
      quantidade: 1,
      status: "Inconsistente",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/51X40Du9otL._SY445_SX342_ControlCacheEqualizer_.jpg",
          titulo: "O Conto da Aia",
          autor: "Margaret Atwood",
          ano: 1985,
          idioma: "Português",
          paginas: 368,
          categoria: "Distopia",
          dataLimite: "01/08/2025",
          preco: 27.5
        }
      ]
    },
    {
      autor: "Cliente 3",
      role: "Requerente",
      titulo: "1984 + Harry Potter",
      data: "20/06/2025",
      faltam: "-50 dias",
      quantidade: 2,
      status: "Inconsistente",
      detalhes: [
        {
          capa: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF894,1000_QL80_.jpg",
          titulo: "1984",
          autor: "George Orwell",
          ano: 1949,
          idioma: "Português",
          paginas: 416,
          categoria: "Ficção Científica",
          dataLimite: "05/07/2025",
          preco: 32.9
        },
        {
          capa: "https://m.media-amazon.com/images/I/81pB+joKL4L._AC_UY327_FMwebp_QL65_.jpg",
          titulo: "Harry Potter e a Pedra Filosofal",
          autor: "J.K. Rowling",
          ano: 1997,
          idioma: "Português",
          paginas: 223,
          categoria: "Fantasia",
          dataLimite: "05/07/2025",
          preco: 11.5
        }
      ]
    }
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
          {dados.map((linha, index) => {
            const total = linha.detalhes.reduce((acc, livro) => acc + livro.preco, 0);

            return (
              <>
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="autor-cell">
                      <i className="bx bx-user"></i>
                      <div className="autor-info">
                        <span className="autor-nome">{linha.autor}</span>
                        <span className="autor-role">{linha.role}</span>
                      </div>
                    </div>
                  </td>
                  <td>{linha.titulo}</td>
                  <td>{linha.data}</td>
                  <td>{linha.faltam}</td>
                  <td>{linha.quantidade}</td>
                  <td>
                    <span className="status-badge status-inconsistente">
                      {linha.status}
                    </span>
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
                        {linha.detalhes.map((livro, i) => (
                          <div key={i} className="detalhes-livro">
                            <img src={livro.capa} alt={`Capa de ${livro.titulo}`} className="detalhes-capa" />
                            <div className="detalhes-info">
                              <h3>{livro.titulo}</h3>
                              <p><strong>Autor:</strong> {livro.autor}</p>
                              <p><strong>Ano:</strong> {livro.ano}</p>
                              <p><strong>Idioma:</strong> {livro.idioma}</p>
                              <p><strong>Páginas:</strong> {livro.paginas}</p>
                              <p><strong>Categoria:</strong> {livro.categoria}</p>
                              <p><strong>Data Limite:</strong> {livro.dataLimite}</p>
                              <p className="reserva-total">Preço: R$ {livro.preco.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}

                        <div className="detalhes-footer">
                          <p className="reserva-total"><strong>Total da Reserva:</strong> R$ {total.toFixed(2)}</p>
                          <div className="detalhes-botoes">
                            <button className="cancelar-btn">Cancelar Reserva</button>
                            <button className="concluir-btn">Entrar em Contato</button>
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
    </div>
  );
};

export default Inconsistencias;
