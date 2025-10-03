import { useState } from "react";
import "./Configuracoes.css";
import { Header } from "../componentes/Header";

export default function Configuracoes() {
    const [activeTab, setActiveTab] = useState("perfil");

    return (
        <div>
            <Header />
            <div className="config-container">
                <div className="config-content">
                    <div className="config-menu">
                        <h1 className="config-title">Configurações</h1>
                        <button
                            className={activeTab === "perfil" ? "active" : ""}
                            onClick={() => setActiveTab("perfil")}
                        >
                            Meu Perfil
                        </button>
                        <button
                            className={activeTab === "seguranca" ? "active" : ""}
                            onClick={() => setActiveTab("seguranca")}
                        >
                            Segurança
                        </button>
                        <button
                            className={activeTab === "ajuda" ? "active" : ""}
                            onClick={() => setActiveTab("ajuda")}
                        >
                            Ajuda e Suporte
                        </button>

                        <button className="btn-delete">Deletar Conta</button>
                    </div>

                    <div className="config-details">
                        {activeTab === "perfil" && (
                            <div className="perfil-section">
                                <div className="perfil-header">
                                    <img
                                        src="https://imgs.search.brave.com/1nUuXPndqOnW3h1NqrJ1QNnAmGPGHY3oxzKTHFleJwM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM5/NDM0NzM2MC9wdC9m/b3RvL2NvbmZpZGVu/dC15b3VuZy1ibGFj/ay1idXNpbmVzc3dv/bWFuLXN0YW5kaW5n/LWF0LWEtd2luZG93/LWluLWFuLW9mZmlj/ZS1hbG9uZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9MWtO/REpFdktydUlLX0pj/dGFHeXpVNUNZSVVE/X3d3WkM2Wi1uTUZ0/NjczND0"
                                        alt="avatar"
                                        className="perfil-avatar"
                                    />
                                    <div>
                                        <h3>nome</h3>
                                        <p>Livros Comprados: 10</p>
                                    </div>
                                </div>

                                <div className="perfil-info">
                                    <div className="perfil-info-header">
                                        <h4>Informações Pessoais</h4>
                                        <button className="btn-editar-info">Editar <i className="bx bx-pencil"></i></button>
                                    </div>
                                    <div className="perfil-grid">
                                        <p><span>Nome Completo:</span> <br />Nome Completo</p>
                                        <p><span>Data de Nascimento:</span> <br />19/04/2005</p>
                                        <p><span>E-mail:</span> <br />nome@gmail.com</p>
                                        <p><span>Telefone:</span> <br />(11) 99999-8888</p>
                                        <p><span>CPF:</span> <br />111.222.333-44</p>
                                    </div>
                                </div>

                                <div className="perfil-historico">
                                    <div className="perfil-historico-header">
                                        <h4>Últimas Compras</h4>
                                    </div>
                                    <table className="tabela-compras">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Livro</th>
                                                <th>Preço</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>10/09/2025</td>
                                                <td>A Biblioteca da Meia-Noite</td>
                                                <td>R$ 15,90</td>
                                                <td>Retirado</td>
                                            </tr>
                                            <tr>
                                                <td>01/09/2025</td>
                                                <td>Dom Casmurro</td>
                                                <td>R$ 22,00</td>
                                                <td>Retirado</td>
                                            </tr>
                                            <tr>
                                                <td>20/08/2025</td>
                                                <td>O Pequeno Príncipe</td>
                                                <td>R$ 8,50</td>
                                                <td>Retirado</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "seguranca" && (
                            <div className="seguranca-section">
                                <h2>Alterar Senha</h2>
                                <form className="form-senha">
                                    <label>Senha Atual</label>
                                    <input type="password" placeholder="Digite sua senha atual" />

                                    <label>Nova Senha</label>
                                    <input type="password" placeholder="Digite sua nova senha" />

                                    <label>Confirmar Nova Senha</label>
                                    <input type="password" placeholder="Confirme sua nova senha" />

                                    <button type="button" className="btn-salvar-senha">
                                        Salvar
                                    </button>
                                </form>

                                <h2>Dicas de Segurança</h2>
                                <ul className="dicas-lista">
                                    <li>Use senhas longas e difíceis de adivinhar.</li>
                                    <li>Não reutilize senhas em outros sites.</li>
                                    <li>Troque sua senha regularmente.</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "ajuda" && (
                            <div className="ajuda-section">
                                <h2>Ajuda e Suporte</h2>
                                <p>Bem-vindo à central de ajuda. Aqui você encontra respostas rápidas e pode falar com nossa equipe.</p>

                                <h3>Perguntas Frequentes (FAQ)</h3>
                                <ul className="faq-lista">
                                    <li>📚 Como reservar um livro? <br /> Vá até a vitrine, escolha o livro e clique em "Reservar".</li>
                                    <li>⏰ Qual o prazo para retirar meu livro? <br /> Até 7 dias úteis após a reserva.</li>
                                    <li>💳 Quais formas de pagamento são aceitas? <br /> Aceitamos cartão e PIX.</li>
                                </ul>

                                <h3>Horário de Atendimento</h3>
                                <p>Segunda a Sexta - 09h às 18h</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
