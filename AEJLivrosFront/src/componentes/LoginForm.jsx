import React, { useState } from 'react';
import { useSafeInput } from '../hooks/useSafeInput';
import { authService } from '../services/authService';
import { loginRateLimiter } from '../utils/securityUtils';
import api from '../services/api';

export function LoginForm({ onCadastroClick }) {
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [tentativasBloqueadas, setTentativasBloqueadas] = useState(false);

    const email = useSafeInput('', 'email');
    const senha = useSafeInput('', 'password');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');

        if (!email.validate() || !senha.validate()) {
            setMensagem('Por favor, corrija os erros');
            return;
        }

        if (!loginRateLimiter.canAttempt(email.value)) {
            setTentativasBloqueadas(true);
            setMensagem('Muitas tentativas. Aguarde 1 minuto.');
            setTimeout(() => {
                setTentativasBloqueadas(false);
                loginRateLimiter.reset(email.value);
            }, 60000);
            return;
        }

        setCarregando(true);


        try {
            const response = await api.post('/usuarios/login', {
                email: email.value,
                senha: senha.value
            });

            console.log('✅ Resposta completa:', response); 
            console.log('✅ Status:', response.status); 
            console.log('✅ Dados:', response.data); 

            const dados = response.data;

            console.log('✅ Token extraído:', dados.token); 

            const tokenSalvo = authService.setToken(dados.token, {
                userId: dados.userId,
                nome: dados.nome,
                email: dados.email
            });

            console.log('✅ Token salvo?', tokenSalvo); 

            if (!tokenSalvo) {
                throw new Error('Erro ao processar autenticação');
            }

            setMensagem('Login realizado com sucesso!');
            email.reset();
            senha.reset();
            loginRateLimiter.reset(email.value);

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);

        } catch (error) {
            console.error('❌ Erro completo:', error); 
            console.error('❌ Resposta do erro:', error.response); 
            console.error('❌ Dados do erro:', error.response?.data); 

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Erro ao realizar login';
            setMensagem(errorMessage);
        }
    };

    return (
        <>
            <p>Boas vindas novamente</p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    value={email.value}
                    onChange={email.handleChange}
                    onBlur={email.handleBlur}
                    disabled={carregando || tentativasBloqueadas}
                />
                {email.error && <span style={{ color: 'red', fontSize: '12px' }}>{email.error}</span>}

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    placeholder="Senha"
                    value={senha.value}
                    onChange={senha.handleChange}
                    onBlur={senha.handleBlur}
                    disabled={carregando || tentativasBloqueadas}
                />
                {senha.error && <span style={{ color: 'red', fontSize: '12px' }}>{senha.error}</span>}

                <span><u>Esqueceu a senha?</u></span>
                <div className="butArea">
                    <button type="submit" disabled={carregando || tentativasBloqueadas}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
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