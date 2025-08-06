import React from 'react';

export function LoginForm({ onCadastroClick }) {
    return (
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
            <div className="outraOp">
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
                    <u style={{ color: '#539ce5', cursor: 'pointer' }} onClick={onCadastroClick}>Cadastre-se</u>
                </span>
            </div>
        </>
    );
}
