import "./VisaoEstante.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import { authService } from '../../services/authService'; 

const VisaoEstante = () => {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const buscarLivros = async () => {
      try {
        const response = await api.get('/livros');
        setLivros(response.data);
      } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
        setErro("Não foi possível carregar os livros.");  
      } finally {
        setCarregando(false);
      }
    };

    buscarLivros();
  }, [navigate]);

  if (carregando) return <p className="carregando">Carregando livros...</p>;
  if (erro) return <p className="erro">{erro}</p>;

  return (
    <div className="estante-container">
      <div className="livros-grid">
        {livros.map((livro, index) => (
          <div key={livro.id || index} className="livro-card">
            <img
              src={livro.capa}
              alt={`Capa de ${livro.titulo}`}
              className="livro-capa"
            />
            <div className="livro-info">
              <span className="livro-categoria">Livro › {livro.nomeCategoria}</span>
              <h3 className="livro-titulo">{livro.titulo}</h3>
              <p className="livro-preco">R$ {livro.preco.toFixed(2) || "0,00"}</p>
              <p className="livro-meta">
                Por: {livro.autor}<br />
                Ano: {livro.anoPublicacao}<br />
                Conservação: {livro.estadoConservacao}<br />
                Acabamento: {livro.tipoAcabamento}<br />
              </p>
              <button
                className="editar-btn"
                onClick={() => navigate(`/editar-livro/${livro.id}`)}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisaoEstante;