import React from 'react';
import { Header } from '../componentes/Header';
import { ModalLogin } from '../componentes/modalLogin';

export default function Login() {
	React.useEffect(() => {
		localStorage.setItem('showCadastro', 'false');
	}, []);
	return (
		<>
			<Header />
			<ModalLogin />
		</>
	);
}
