import "../StyleAej.css";

export function Depoimentos({ depoimentos }) {
  return (
    <div className="depSpace">
      {depoimentos.map((dep, index) => (
        <div key={index} className="depoimento">
          <div className="depoimento-texto">
            <i className="bx bxs-user-circle"></i>
            <p>"{dep.texto}"</p>
          </div>
          <div className="depoimento-autor">
            <p>- {dep.nome}</p>
          </div>
        </div>
      ))}
    </div>
  );
}