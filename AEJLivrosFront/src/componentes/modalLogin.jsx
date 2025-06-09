import '../StyleAej.css'
import image from '../assets/AejLogo.png'
import image2 from '../assets/Leitora.png'
import React, { useState, useEffect } from 'react';

export function ModalLogin() {
    const [showCadastro, setShowCadastro] = useState(() => {
        const saved = localStorage.getItem('showCadastro');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('showCadastro', showCadastro);
    }, [showCadastro]);

    function CadastroClick() {
        setShowCadastro(true);
    }

    function VoltarLogin() {
        setShowCadastro(false);
    }

    return (
        <div className="modalArea">
            <div className="modal">
                <div className="blue"></div>
                <div className="header">
                    <div className="logo">
                        <img src={image} alt="Logo AEJ Livros" />
                    </div>
                </div>
                <div className="loginContent">
                    <div className="formArea">
                        <div className="formAlign">
                            {showCadastro ? (
                                <>
                                    <p>Crie sua conta</p>
                                    <h1>Cadastro</h1>
                                    <form>
                                        <label htmlFor="nome">Nome completo</label>
                                        <input id="nome" type="text" placeholder="Nome completo" />
                                        <label htmlFor="email">E-mail</label>
                                        <input id="email" type="email" placeholder="E-mail" />
                                        <label htmlFor="cpf">CPF</label>
                                        <input id="cpf" type="text" placeholder="CPF" />
                                        <div className="input-row">
                                            <div className="input-col">
                                                <label htmlFor="nascimento">Data de nascimento</label>
                                                <input id="nascimento" type="date" />
                                            </div>
                                            <div className="input-col">
                                                <label htmlFor="telefone">Telefone</label>
                                                <input id="telefone" type="tel" placeholder="Telefone" />
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-col">
                                                <label htmlFor="senhaCadastro">Senha</label>
                                                <input id="senhaCadastro" type="password" placeholder="Senha" />
                                            </div>
                                            <div className="input-col">
                                                <label htmlFor="confirmaSenha">Confirmar senha</label>
                                                <input id="confirmaSenha" type="password" placeholder="Confirmar senha" />
                                            </div>
                                        </div>
                                        <div className="butArea">
                                            <button type="submit">Cadastrar</button>
                                        </div>
                                    </form>
                                    <span style={{ marginTop: '16px', textAlign: 'center' }}>
                                        Já possui uma conta?{' '}
                                        <u style={{ cursor: 'pointer', color: '#539ce5' }} onClick={VoltarLogin}>Voltar para o login</u>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <p>Boas vindas novamente</p>
                                    <h1>Login</h1>
                                    <form>
                                        <label htmlFor="usuario">Usuário</label>
                                        <input id="usuario" type="text" placeholder="Usuário" />
                                        <label htmlFor="senha">Senha <span><u>Esqueceu a senha?</u></span></label>
                                        <input id="senha" type="password" placeholder="Senha" />
                                        <div className="butArea">
                                            <button type="submit">Entrar</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                        <div className="outraOp">
                            {showCadastro ? null : (
                                <>
                                    <span>Ou continue com</span>
                                    <div className="options">
                                        <button className="google">
                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
                                        </button>
                                        <button className="apple">
                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple" style={{ width: '24px', height: '24px' }} />
                                        </button>
                                        <button className="facebook">
                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                                        </button>
                                    </div>
                                    <span>
                                        Ainda não possui uma conta?{' '}
                                        <u style={{ color: '#539ce5', cursor: 'pointer' }} onClick={CadastroClick}>Cadastre-se</u>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="imageArea">
                        <img src={image2} alt="Leitora" />
                    </div>
                </div>
            </div>
        </div>
    );
}