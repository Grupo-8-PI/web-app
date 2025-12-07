import React, { useState } from 'react';
import { handleHttpError, validateForm, formatCPF, formatTelefone } from '../utils/errorHandler';
import api from '../services/api';

export function CadastroForm({ onVoltarLogin }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [mensagem, setMensagem] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleCpfChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); 
        if (value.length <= 11) {
            setCpf(value);
        }
    };

    const handleTelefoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); 
        if (value.length <= 11) {
            setTelefone(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setMensagem({ text: "", type: "" });

        if (senha !== confirmaSenha) {
            setMensagem({ 
                text: 'As senhas não coincidem. Digite a mesma senha nos dois campos.', 
                type: 'warning' 
            });
            return;
        }

        const data = {
            nome: nome.trim(),
            email: email.trim(),
            telefone: telefone.replace(/\D/g, ''), 
            tipo_usuario: "cliente",
            cpf: cpf.replace(/\D/g, ''), 
            senha,
            dtNascimento: nascimento
        };
        const validationError = validateForm(data, 'cadastro');
        if (validationError) {
            setMensagem({ 
                text: validationError.message, 
                type: 'warning' 
            });
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/usuarios', data);

            setMensagem({ 
                text: 'Cadastro realizado com sucesso! Você já pode fazer login.', 
                type: 'success' 
            });
            
            setTimeout(() => {
                setNome("");
                setEmail("");
                setCpf("");
                setNascimento("");
                setTelefone("");
                setSenha("");
                setConfirmaSenha("");
                
                setTimeout(() => {
                    onVoltarLogin();
                }, 2000);
            }, 1000);
        } catch (error) {
            console.error('[CadastroForm] Erro na requisição:', error);
            
            const handledError = handleHttpError(error, 'cadastro');
            setMensagem({ 
                text: handledError.message, 
                type: handledError.type 
            });
        } finally {
            setLoading(false);
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
            <p>Crie sua conta</p>
            <h1>Cadastro</h1>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome completo</label>
                <input 
                    id="nome" 
                    type="text" 
                    placeholder="Nome completo" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)}
                    disabled={loading}
                    required
                />
                
                <label htmlFor="email">E-mail</label>
                <input 
                    id="email" 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />
                
                <label htmlFor="cpf">CPF</label>
                <input 
                    id="cpf" 
                    type="text" 
                    placeholder="000.000.000-00" 
                    value={formatCPF(cpf)} 
                    onChange={handleCpfChange}
                    disabled={loading}
                    required
                />
                
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="nascimento">Data de nascimento</label>
                        <input 
                            id="nascimento" 
                            type="date" 
                            value={nascimento} 
                            onChange={e => setNascimento(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="input-col">
                        <label htmlFor="telefone">Telefone</label>
                        <input 
                            id="telefone" 
                            type="tel" 
                            placeholder="(00) 00000-0000" 
                            value={formatTelefone(telefone)} 
                            onChange={handleTelefoneChange}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>
                
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="senhaCadastro">Senha</label>
                        <input 
                            id="senhaCadastro" 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)}
                            disabled={loading}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="input-col">
                        <label htmlFor="confirmaSenha">Confirmar senha</label>
                        <input 
                            id="confirmaSenha" 
                            type="password" 
                            placeholder="Confirmar senha" 
                            value={confirmaSenha} 
                            onChange={e => setConfirmaSenha(e.target.value)}
                            disabled={loading}
                            minLength={6}
                            required
                        />
                    </div>
                </div>
                
                <div className="butArea">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
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
                        textAlign: 'center'
                    }}
                >
                    {mensagem.text}
                </div>
            )}
            
            <span style={{ marginTop: '16px', textAlign: 'center', display: 'block' }}>
                Já possui uma conta?{' '}
                <u 
                    style={{ cursor: 'pointer', color: '#539ce5' }} 
                    onClick={!loading ? onVoltarLogin : undefined}
                >
                    Voltar para o login
                </u>
            </span>
        </>
    );
}