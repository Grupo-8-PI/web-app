import React from 'react';

export function CadastroForm({ onVoltarLogin }) {
    return (
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
                <u style={{ cursor: 'pointer', color: '#539ce5' }} onClick={onVoltarLogin}>Voltar para o login</u>
            </span>
        </>
    );
}
