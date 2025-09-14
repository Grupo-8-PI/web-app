import { Header } from "../componentes/Header";
import '../StyleAej.css'
import CategoriaCard from "../componentes/CategoriaCard";

export default function Categorias() {
    return (
        <div>
            <Header/>
            <div className="catSpace2">
                <h2>Selecione uma categoria:</h2>
                <div className="catGrid">
                    <CategoriaCard titulo="Romance" icone="😊" alt="Romance" />
                    <CategoriaCard titulo="Ficção Científica" icone="📄" alt="Ficção Científica" />
                    <CategoriaCard titulo="Culinária" icone="🍕" alt="Culinária" />
                    <CategoriaCard titulo="Distopia" icone="👥" alt="Distopia" />
                    <CategoriaCard titulo="Mistérios/Suspense" icone="😊" alt="Mistérios/Suspense" />
                    <CategoriaCard titulo="Terror" icone="📄" alt="Terror" />
                    <CategoriaCard titulo="Filosofia" icone="🍕" alt="Filosofia" />
                    <CategoriaCard titulo="Outros" icone="👥" alt="Outros" />
                </div>
            </div>
        </div>
    );
}
