import '../styles/globals.css';
import '@fontsource/spartan';
import { AuthProvider } from '../contexts/AuthContext';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp;
