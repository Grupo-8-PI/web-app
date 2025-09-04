import "./Cards.css";

function Cards() {
  return (
    <div className="cards">
      <div className="card">Valor estimado do estoque atual<br/><b>R$ 330,59</b></div>
      <div className="card">Conservação boa<br/><b>37%</b></div>
      <div className="card">Conservação média<br/><b>53%</b></div>
      <div className="card">Conservação ruim<br/><b>10%</b></div>
    </div>
  );
}

export default Cards;
