import "./CadastrarLivro.css";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";

export default function CadastrarLivro() {
    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main">
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
                    <button className="btn-cadastrar1" onClick={() => navigate("/cadastrar-livro")}>+ Cadastrar Livro</button>
                </header>

                <div className="dashboard-content">
                    <PainelUsuario />

                    <div className="cadastrar-livro-container">
                        <div className="breadcrumb">Visão Estante &gt; Cadastrar Livro</div>

                        <div className="cadastrar-livro-content">
                            <div className="livro-preview">
                                <div className="miniaturas">
                                    <img src="https://m.media-amazon.com/images/I/81rTSs7auzL._SY425_.jpg" alt="miniatura" className="miniatura" />
                                    <img src="https://m.media-amazon.com/images/I/71M1u0K+Z6L._SY425_.jpg" alt="miniatura" className="miniatura" />
                                    <button className="btn-add-img">+</button>
                                </div>
                                <img
                                    src="https://m.media-amazon.com/images/I/51kAYMwbQIL._SY445_SX342_ControlCacheEqualizer_.jpg"
                                    alt="livro"
                                    className="imagem-principal"
                                />
                            </div>

                            <div className="livro-form">
                                <h2>Insira o ISBN</h2>
                                <p>
                                    Insira o ISBN e as informações serão preenchidas de forma automática.
                                </p>

                                <form>
                                    <div className="form-group">
                                        <label>ISBN</label>
                                        <input type="text" placeholder="Digite o ISBN" />
                                    </div>

                                    <div className="form-group">
                                        <label>Ano Lançamento</label>
                                        <input type="text" placeholder="27/09/2021" disabled />
                                    </div>

                                    <div className="form-group">
                                        <label>Nome do Livro</label>
                                        <input type="text" placeholder="A Biblioteca da Meia-Noite" disabled />
                                    </div>

                                    <div className="form-group">
                                        <label>Autor do Livro</label>
                                        <input type="text" placeholder="Matt Haig" disabled />
                                    </div>

                                    <div className="form-group">
                                        <label>Estado do Livro</label>
                                        <select>
                                            <option>Novo</option>
                                            <option>Usado - Bom</option>
                                            <option>Usado - Regular</option>
                                        </select>
                                    </div>

                                    <div className="form-buttons">
                                        <button type="button" className="btn-cancelar">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-cadastrar-livro">
                                            Cadastrar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
