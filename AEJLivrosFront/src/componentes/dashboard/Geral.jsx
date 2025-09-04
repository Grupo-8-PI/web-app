import Cards from "./Cards";
import Charts from "./Charts";
import Charts2 from "./Charts2";
import TempoCatalogo from "./TempoCatalogo";

const Geral = () => {
  return (
    <>
      <div className="cards">
        <Cards />
      </div>

      <div className="charts">
        <div className="top">
          <Charts />
        </div>
        <div className="bottom">
          <Charts2 />
          <TempoCatalogo />
        </div>
      </div>
    </>
  );
};

export default Geral;