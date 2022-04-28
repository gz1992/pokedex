import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import InputForm from '../../components/Inputs/InputForm';
import InputSubmit from '../../components/Inputs/InputSubmit';

import logo from '../../public/imgs/big-logo.png';

import styles from './styles.module.css';
export default function LoginPage() {
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		const userEmail = e.currentTarget.querySelector(
			'input[name=user_email]'
		) as HTMLInputElement;
		if (userEmail) {
			formData.append('username', userEmail.value);
		}
		const userPassword = e.currentTarget.querySelector(
			'input[name=user_password]'
		) as HTMLInputElement;
		if (userPassword) {
			formData.append('password', userPassword.value);
		}
		const res = await fetch(`http://localhost:8001/token`, {
			method: 'POST',
			body: formData,
		});
		if (res.status == 200) {
			const json = await res.json();
			console.log(json);
			localStorage.setItem('token', json.access_token);
			router.push('/list');
		} else {
			alert('Login failed.');
		}
	};

	return (
		<div className={styles.login}>
			<Image src={logo} alt="Pokemon Logo" />
			<form
				className={styles.loginForm}
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<h3>
					<b>Bem-vindo</b>
				</h3>
				<p>Insira os seus dados para acessar</p>
				<InputForm title="Email" name="user_email" type="email" placeholder="" />
				<InputForm name="user_password" type="password" placeholder="Senha" />
				<InputSubmit value="Login" padding="0.75rem 0.5rem" />
			</form>
		</div>
	);
}
