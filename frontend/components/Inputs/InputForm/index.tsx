import { useState } from 'react';
import EyeSvg from '../../EyeSvg';
import styles from './styles.module.css';

type InputFormType = {
	name: string;
	type: string;
	placeholder: string;
	title?: string;
};

export default function InputForm({ name, type, placeholder, title }: InputFormType) {
	const [active, setActive] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className={active ? `${styles.inputForm} ${styles.active}` : styles.inputForm}>
			{title && <p className={styles.title}>{title}</p>}
			<input
				name={name}
				type={type === 'password' && showPassword ? 'text' : type}
				onFocus={() => {
					setActive(true);
				}}
				onBlur={() => {
					setActive(false);
				}}
				placeholder={placeholder}
			/>
			{type === 'password' && (
				<a
					className={styles.showPassword}
					onClick={() => {
						setShowPassword(!showPassword);
					}}
				>
					<EyeSvg />
				</a>
			)}
		</div>
	);
}
