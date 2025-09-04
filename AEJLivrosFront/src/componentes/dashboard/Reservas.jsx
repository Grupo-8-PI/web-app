import "./Tabela.css";

const Reservas = () => {
  const reservas = [
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" },
    { autor: "Nome Usuário", titulo: "*", data: "*", faltam: "*", quantidade: "*", status: "Ok" }
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
          {reservas.map((reserva, index) => (
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
            </tr>
          ))}
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