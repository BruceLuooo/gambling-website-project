import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { GetGamesProvider } from '../context/GetGamesContext';
import { PersonalInfoProvider } from '../context/personalInfoContext';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<PersonalInfoProvider>
			<GetGamesProvider>
				<Navbar />
				<Component {...pageProps} />
			</GetGamesProvider>
		</PersonalInfoProvider>
	);
}
