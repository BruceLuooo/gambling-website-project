import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { GetGamesProvider } from '../context/GetGamesContext';
import { PersonalInfoProvider } from '../context/personalInfoContext';
import NavbarIcons from '../components/NavbarIcons';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<PersonalInfoProvider>
			<GetGamesProvider>
				<NavbarIcons />
				<Component {...pageProps} />
			</GetGamesProvider>
		</PersonalInfoProvider>
	);
}
