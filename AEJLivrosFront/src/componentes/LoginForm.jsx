import React, { useState } from 'react';
import { useSafeInput } from '../hooks/useSafeInput';
import { authService } from '../services/authService';
import { loginRateLimiter } from '../utils/securityUtils';
import { handleHttpError, validateForm } from '../utils/errorHandler';
import { extractRole, getRedirectRoute, normalizeRole } from '../utils/roleUtils';
import api from '../services/api';

export function LoginForm({ onCadastroClick }) {
    const [mensagem, setMensagem] = useState({ text: "", type: "" });
    const [carregando, setCarregando] = useState(false);
    const [tentativasBloqueadas, setTentativasBloqueadas] = useState(false);

    const email = useSafeInput('', 'email');
    const senha = useSafeInput('', 'password');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ text: '', type: '' });

        if (!email.validate() || !senha.validate()) {
            setMensagem({ 
                text: 'Por favor, corrija os campos destacados em vermelho.', 
                type: 'warning' 
            });
            return;
        }

        if (!loginRateLimiter.canAttempt(email.value)) {
            setTentativasBloqueadas(true);
            setMensagem({ 
                text: 'Muitas tentativas de login. Por segurança, aguarde 1 minuto antes de tentar novamente.', 
                type: 'warning' 
            });
            setTimeout(() => {
                setTentativasBloqueadas(false);
                loginRateLimiter.reset(email.value);
                setMensagem({ text: '', type: '' });
            }, 60000);
            return;
        }

        const data = {
            email: email.value,
            senha: senha.value
        };

        const validationError = validateForm(data, 'login');
        if (validationError) {
            setMensagem({ 
                text: validationError.message, 
                type: 'warning' 
            });
            return;
        }

        setCarregando(true);

        try {
            console.log('[LoginForm] Tentando fazer login...');
            
            const response = await api.post('/usuarios/login', data);

            console.log('✅ Resposta completa:', response); 
            console.log('✅ Status:', response.status); 
            console.log('✅ Dados:', response.data); 

            const dados = response.data;

            console.log('✅ Token extraído:', dados.token); 
            console.log('✅ Dados completos do login:', dados);
            
            // Extract and normalize role using utility
            const userRole = extractRole(dados);
            console.log('✅ Tipo de usuário normalizado:', userRole);
            
            // Extract user ID from response (try different field names)
            const userId = dados.id || dados.userId || dados.usuarioId;
            console.log('✅ User ID extraído:', userId);

            const tokenSalvo = authService.setToken(dados.token, {
                id: userId,
                userId: userId,
                nome: dados.nome,
                email: dados.email,
                role: userRole
            });

            console.log('✅ Token salvo?', tokenSalvo); 

            if (!tokenSalvo) {
                throw new Error('Erro ao processar autenticação');
            }

            // Get redirect route based on role
            const rotaDestino = getRedirectRoute(userRole);
            console.log(`[LoginForm] ✅ Redirecionando ${userRole} para ${rotaDestino}`);
            
            // Store normalized role
            sessionStorage.setItem('userRole', userRole);

            setMensagem({ 
                text: 'Login realizado com sucesso! Redirecionando...', 
                type: 'success' 
            });

            email.reset();
            senha.reset();
            loginRateLimiter.reset(email.value);

            setTimeout(() => {
                window.location.href = rotaDestino;
            }, 1000);

        } catch (error) {
            console.error('❌ Erro completo:', error); 
            console.error('❌ Resposta do erro:', error.response); 
            console.error('❌ Dados do erro:', error.response?.data); 

            const handledError = handleHttpError(error, 'login');
            
            setMensagem({ 
                text: handledError.message, 
                type: handledError.type 
            });

            loginRateLimiter.recordAttempt(email.value);
        } finally {
            setCarregando(false);
        }
    };

    const getMessageColor = () => {
        switch (mensagem.type) {
            case 'success':
                return '#22c55e'; 
            case 'warning':
                return '#f59e0b'; 
            case 'error':
                return '#ef4444'; 
            default:
                return '#6b7280'; 
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
                    placeholder="Digite seu e-mail"
                    value={email.value}
                    onChange={email.handleChange}
                    onBlur={email.handleBlur}
                    disabled={carregando || tentativasBloqueadas}
                    autoComplete="email"
                />
                {email.error && (
                    <span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        {email.error}
                    </span>
                )}

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha.value}
                    onChange={senha.handleChange}
                    onBlur={senha.handleBlur}
                    disabled={carregando || tentativasBloqueadas}
                    autoComplete="current-password"
                />
                {senha.error && (
                    <span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        {senha.error}
                    </span>
                )}

                <span><u>Esqueceu a senha?</u></span>
                
                <div className="butArea">
                    <button type="submit" disabled={carregando || tentativasBloqueadas}>
                        {carregando ? 'Entrando...' : tentativasBloqueadas ? 'Aguarde...' : 'Entrar'}
                    </button>
                </div>
            </form>
            
            {mensagem.text && (
                <div 
                    style={{ 
                        marginTop: '16px', 
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: mensagem.type === 'success' ? '#f0fdf4' : 
                                       mensagem.type === 'warning' ? '#fffbeb' : '#fef2f2',
                        border: `1px solid ${getMessageColor()}`,
                        color: getMessageColor(),
                        fontSize: '14px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {mensagem.text}
                </div>
            )}
            
            <div className="outraOp">
                <span>Ou continue com</span>
                <div className="options">
                    <button 
                        className="google" 
                        type="button"
                        disabled={carregando || tentativasBloqueadas}
                    >
                        <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                            alt="Google" 
                            style={{ width: '24px', height: '24px' }} 
                        />
                    </button>
                    <button 
                        className="apple" 
                        type="button"
                        disabled={carregando || tentativasBloqueadas}
                    >
                        <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" 
                            alt="Apple" 
                            style={{ width: '24px', height: '24px' }} 
                        />
                    </button>
                    <button 
                        className="facebook" 
                        type="button"
                        disabled={carregando || tentativasBloqueadas}
                    >
                        <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" 
                            alt="Facebook" 
                            style={{ width: '24px', height: '24px' }} 
                        />
                    </button>
                </div>
                <span>
                    Ainda não possui uma conta?{' '}
                    <u 
                        style={{ color: '#539ce5', cursor: 'pointer' }} 
                        onClick={!carregando && !tentativasBloqueadas ? onCadastroClick : undefined}
                    >
                        Cadastre-se
                    </u>
                </span>
            </div>
        </>
    );
}