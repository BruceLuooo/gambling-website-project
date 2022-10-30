import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { GetGamesProvider } from '../context/GetGamesContext';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<GetGamesProvider>
			<Navbar />
			<Component {...pageProps} />
		</GetGamesProvider>
	);
}
