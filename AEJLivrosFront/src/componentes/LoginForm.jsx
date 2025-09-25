import React, { useState } from 'react';

export function LoginForm({ onCadastroClick }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { email, senha };

        try {
            const response = await fetch('http://localhost:8080/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setMensagem('Login realizado com sucesso!');
                window.location.href = '/dashboard'; 
            } else {
                const errorData = await response.json();
                setMensagem(errorData.message || 'Erro ao realizar login.');
            }
        } catch (error) {
            setMensagem('Erro de conexão com o servidor.');
        }
    };

    return (
        <>
            <p>Boas vindas novamente</p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                <span><u>Esqueceu a senha?</u></span>
                <div className="butArea">
                    <button type="submit">Entrar</button>
                </div>
            </form>
            {mensagem && <div style={{ marginTop: '10px', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</div>}
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
