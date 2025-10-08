import "./EditarLivro.css";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";

export default function EditarLivro() {
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

                    <div className="editar-livro-container">
                        <div className="breadcrumb">Visão Estante &gt; Cadastrar Livro</div>

                        <div className="editar-livro-content">
                            <div className="livro-preview">
                                <div className="miniaturas">
                                    <img src="https://m.media-amazon.com/images/I/81ZuLJhV04L._SY425_.jpg" alt="miniatura" className="miniatura" />
                                    <img src="https://m.media-amazon.com/images/I/71pJb5Tb4mL._SY425_.jpg" alt="miniatura" className="miniatura" />
                                    <button className="btn-add-img">+</button>
                                </div>
                                <img
                                    src="https://m.media-amazon.com/images/I/41Od9BeoEhL._SY445_SX342_ControlCacheEqualizer_.jpg"
                                    alt="livro"
                                    className="imagem-principal"
                                />
                            </div>

                            <div className="livro-form">
                                <h2>Editar Livro</h2>
                                <p>
                                    Edite apenas os campos que não estão bloqueados.
                                </p>

                                <form>
                                    <div className="form-group">
                                        <label>ISBN</label>
                                        <input type="text" placeholder="Digite o ISBN" disabled/>
                                    </div>

                                    <div className="form-group">
                                        <label>Ano Lançamento</label>
                                        <input type="text" placeholder="08/02/2021"  />
                                    </div>

                                    <div className="form-group">
                                        <label>Nome do Livro</label>
                                        <input type="text" placeholder="Tudo é Rio"  />
                                    </div>

                                    <div className="form-group">
                                        <label>Autor do Livro</label>
                                        <input type="text" placeholder="Carla Madeira"  />
                                    </div>

                                    <div className="form-group">
                                        <label>Preço</label>
                                        <input type="text" placeholder="Digite o preço do livro"  />
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
                                        <button type="button" className="btn-cancelar-edicao">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-salvar-livro">
                                            Salvar
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
