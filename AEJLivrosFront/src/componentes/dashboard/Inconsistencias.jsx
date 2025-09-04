import "./Tabela.css";

const Inconsistencias = () => {
  const dados = [
    { autor: "Nome Usuário", role: "Requerente", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Inconsistente" },
    { autor: "Nome Usuário", role: "Requerente", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Inconsistente" },
  ];

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
          </tr>
        </thead>
        <tbody>
          {dados.map((linha, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inconsistencias;
