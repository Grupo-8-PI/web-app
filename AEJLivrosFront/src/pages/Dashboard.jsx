import { useState } from "react";
import "./Dashboard.css";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";
import MenuTabs from "../componentes/dashboard/MenuTabs";

// Páginas internas
import Geral from "../componentes/dashboard/Geral";
import Reservas from "../componentes/dashboard/Reservas";
import Inconsistencias from "../componentes/dashboard/Inconsistencias";
import VisaoEstante from "../componentes/dashboard/VisaoEstante";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Geral");

    const renderContent = () => {
        switch (activeTab) {
            case "Geral":
                return <Geral />;
            case "Reservas":
                return <Reservas />;
            case "Inconsistencias":
                return <Inconsistencias />;
            case "Visao-estante":
                return <VisaoEstante />;
            default:
                return <Geral />;
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            <main className="content">
                <header className="header">
                    <h1>Dashboard</h1>
                    <div className="rightSpace">
                        <div className="searchBox">
                            <i className="bx bx-search-alt-2"></i>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="searchInput"
                            />
                        </div>
                    </div>
                </header>

                <div className="menu-tabs-section">
                    <MenuTabs activeTab={activeTab} onChange={setActiveTab} />
                </div>

                <div className="main-layout">
                    <div className="main-content">
                        {renderContent()}
                    </div>

                    <aside className="painelUsuario">

                        <PainelUsuario />
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
