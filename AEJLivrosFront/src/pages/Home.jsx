import { Acessibilidade } from "../componentes/Acessibilidade";
import { Header } from "../componentes/Header";

export default function Home() {
    return (
        <div>
            <Acessibilidade/>
            <session className="primeira">

            <Header/>
            </session>
            <session className="segunda">
                <div className="recomend">
                    <h2>Recomendações</h2>
                    <div className="recSpace"></div>
                </div>
                <div className="cat">
                    <h2>Categorias</h2>
                    <div className="catSpace"></div>
                </div>
            </session>
        </div>
    );
}
