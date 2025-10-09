import FiltroCatalogo from "../componentes/FiltroCatalogo";
import { Header } from "../componentes/Header";
import Reservas from "../componentes/Reservas";
import "./cssPages/minhasReservas.css";

export default function MinhasReservas() {
    return (
        <div>
            <Header />
            <div className="reserv-cont">
                <div className="filtroEsp">
                    <FiltroCatalogo />
                </div>
                <div className="reservEsp">
                    <Reservas />
                    <Reservas />
                    </div>

            </div>
        </div>
    );
}
