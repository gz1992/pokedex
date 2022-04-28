import styles from './styles.module.css';

type InputSubmitType = {
	value: string;
	padding?: string;
};

export default function InputSubmit({ value, padding }: InputSubmitType) {
	if (padding) {
		return (
			<input
				className={styles.submit}
				type="submit"
				value={value}
				style={{ padding: padding }}
			/>
		);
	}
	return <input className={styles.submit} type="submit" value={value} />;
}
