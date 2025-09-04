import { useState } from "react";

// Páginas internas
import Geral from "./Geral";
import Reservas from "./Reservas"; 
import Inconsistencias from "./Inconsistencias"; 
import VisaoEstante from "./VisaoEstante"; 

const Visao = () => {
  const [activeTab, setActiveTab] = useState("Geral");

  const renderContent = () => {
    switch (activeTab) {
      case "Geral":
        return <Geral />;
      case "Reservas":
        return <Reservas />;
      case "Inconsistências":
        return <Inconsistencias />;
      case "Visão Estante":
        return <VisaoEstante />;
      default:
        return <Geral />;
    }
  };

  return (
    <div>Em desenvolvimento</div>
  );
};

export default Visao;
