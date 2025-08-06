import '../StyleAej.css'
import image from '../assets/AejLogo.png'
import image2 from '../assets/Leitora.png'
import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { CadastroForm } from './CadastroForm';

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
                                <CadastroForm onVoltarLogin={VoltarLogin} />
                            ) : (
                                <LoginForm onCadastroClick={CadastroClick} />
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