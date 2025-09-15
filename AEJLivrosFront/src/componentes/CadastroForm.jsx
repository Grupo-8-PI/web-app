import React, { useState } from 'react';

export function CadastroForm({ onVoltarLogin }) {
    
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nome,
            email,
            cpf,
            nascimento,
            telefone,
            senha,
            confirmaSenha
        };
        try {
            const response = await fetch('http://localhost:8080/api-service/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setMensagem('Cadastro realizado com sucesso!');
            } else {
                setMensagem('Erro ao cadastrar.');
            }
        } catch (error) {
            setMensagem('Erro de conexão com o servidor.');
        }
    };

    return (
        <>
            <p>Crie sua conta</p>
            <h1>Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="nascimento">Data de nascimento</label>
                        <input id="nascimento" type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} />
                    </div>
                    <div className="input-col">
                        <label htmlFor="telefone">Telefone</label>
                        <input id="telefone" type="tel" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="senhaCadastro">Senha</label>
                        <input id="senhaCadastro" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    </div>
                    <div className="input-col">
                        <label htmlFor="confirmaSenha">Confirmar senha</label>
                        <input id="confirmaSenha" type="password" placeholder="Confirmar senha" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} />
                    </div>
                </div>
                <div className="butArea">
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
            {mensagem && <div style={{ marginTop: '10px', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</div>}
            <span style={{ marginTop: '16px', textAlign: 'center' }}>
                Já possui uma conta?{' '}
                <u style={{ cursor: 'pointer', color: '#539ce5' }} onClick={onVoltarLogin}>Voltar para o login</u>
            </span>
        </>
    );
}
