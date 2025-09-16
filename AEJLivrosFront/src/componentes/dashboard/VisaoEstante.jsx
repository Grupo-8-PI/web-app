import "./VisaoEstante.css";

const VisaoEstante = () => {
  const livros = [
    {
      capa: "https://m.media-amazon.com/images/I/816Udvs9O7L._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "Tudo é Rio",
      autor: "Carla Madeira",
      ano: 2021,
      categoria: "Ficção",
      conservacao: "Boa",
      preco: 11.5,
    },
    {
      capa: "https://m.media-amazon.com/images/I/81BdpMhm3iL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "A Empregada: Bem-vinda à família",
      autor: "Freida McFadden",
      ano: 2023,
      categoria: "Mistério",
      conservacao: "Ótima",
      preco: 8.5,
    },
    {
      capa: "https://m.media-amazon.com/images/I/81Q+2zleuwL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "Harry Potter e o Prisioneiro de Azkaban",
      autor: "J. K. Rowling",
      ano: 2024,
      categoria: "Literatura Infantil",
      conservacao: "Ótima",
      preco: 18.5,
    },
    {
      capa: "https://m.media-amazon.com/images/I/71fEYN72-UL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "Amanhecer na Colheita",
      autor: "Suzanne Collins",
      ano: 2025,
      categoria: "Ação e Aventura",
      conservacao: "Ótima",
      preco: 20.5,
    },
    {
      capa: "https://m.media-amazon.com/images/I/71pQJpsu2IL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "Percy Jackson e o Ladrão de Raios",
      autor: "Rick Riordan",
      ano: 2006,
      categoria: "Literatura Infantil",
      conservacao: "Ruim",
      preco: 2.5,
    },
    {
      capa: "https://m.media-amazon.com/images/I/91ADwCpigxL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "Véspera",
      autor: "Carla Madeira",
      ano: 2020,
      categoria: "Romance",
      conservacao: "Boa",
      preco: 15.0,
    },
    {
      capa: "https://m.media-amazon.com/images/I/91jny5rWgES._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "O Hobbit anotado",
      autor: "J. R. R. Tolkien",
      ano: 2021,
      categoria: "Fantasia",
      conservacao: "Boa",
      preco: 25.0,
    },
    {
      capa: "https://m.media-amazon.com/images/I/81hCVEC0ExL._AC_UL480_FMwebp_QL65_.jpg",
      titulo: "O Senhor dos Anéis: A Sociedade do Anel",
      autor: "J. R. R. Tolkien",
      ano: 1954,
      categoria: "Fantasia",
      conservacao: "Ótima",
      preco: 30.0,
    },
  ];

  return (
    <div className="estante-container">
      <div className="livros-grid">
        {livros.map((livro, index) => (
          <div key={index} className="livro-card">
            <img src={livro.capa} alt={`Capa de ${livro.titulo}`} className="livro-capa" />
            <div className="livro-info">
              <span className="livro-categoria">Livro › {livro.categoria}</span>
              <h3 className="livro-titulo">{livro.titulo}</h3>
              <p className="livro-preco">R$ {livro.preco.toFixed(2)}</p>
              <p className="livro-meta">
                Por: {livro.autor}<br />
                Ano: {livro.ano}<br />
                Conservação: {livro.conservacao}
              </p>
              <button className="editar-btn">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisaoEstante;