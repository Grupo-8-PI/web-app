import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";
import MenuTabs from "../componentes/dashboard/MenuTabs";

import Geral from "../componentes/dashboard/Geral";
import Reservas from "../componentes/dashboard/Reservas";
import Inconsistencias from "../componentes/dashboard/Inconsistencias";
import VisaoEstante from "../componentes/dashboard/VisaoEstante";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Geral");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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
            <div className="sidebarD">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <main className="content">
                <div className="right-cont">
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
                        <button className="btn-cadastrar" onClick={() => navigate("/cadastrar-livro")}>+ Cadastrar Livro</button>
                    </header>

                    <div className="menu-tabs-section">
                        <MenuTabs activeTab={activeTab} onChange={setActiveTab} />
                    </div>

                    <div className="main-layout">
                        <div className="main-content">
                            {renderContent()}
                        </div>

                        <div className="painelUsuario">
                            <PainelUsuario />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;