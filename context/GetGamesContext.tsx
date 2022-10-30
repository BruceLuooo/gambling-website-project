import { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import Home from '../pages';

interface getGames {
	id: string;
	homeTeam: string;
	awayTeam: string;
	startTime: string;
	teamOneOdds: {
		name: string;
		odds: number;
	};
	teamTwoOdds: {
		name: string;
		odds: number;
	};
}

type GamesContext = {
	upcomingGames: getGames[];
};

interface Props {
	children: ReactNode;
}

export const GetGamesContext = createContext<GamesContext | null>(null);

export const GetGamesProvider = ({ children }: Props) => {
	const [upcomingGames, setUpcomingGames] = useState<getGames[]>([]);

	useEffect(() => {
		const options = {
			method: 'GET',
			url: 'https://odds.p.rapidapi.com/v4/sports/basketball/odds',
			params: {
				sport: 'basketball',
				regions: 'us',
				dateFormat: 'iso',
				oddsFormat: 'decimal',
				markets: 'h2h,spreads',
			},
			headers: {
				'X-RapidAPI-Key': '2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9',
				'X-RapidAPI-Host': 'odds.p.rapidapi.com',
			},
		};
		const getUpcomingGames = async () => {
			await axios.request(options).then(response => {
				response.data.forEach((data: any) => {
					setUpcomingGames(prev => [
						...prev,
						{
							id: data.id,
							homeTeam: data.home_team,
							awayTeam: data.away_team,
							startTime: data.commence_time,
							teamOneOdds: {
								name: data.bookmakers[0].markets[0].outcomes[0].name,
								odds: data.bookmakers[0].markets[0].outcomes[0].price,
							},
							teamTwoOdds: {
								name: data.bookmakers[0].markets[0].outcomes[1].name,
								odds: data.bookmakers[0].markets[0].outcomes[1].price,
							},
						},
					]);
				});
			});
		};
		getUpcomingGames();
	}, []);

	return (
		<GetGamesContext.Provider value={{ upcomingGames }}>
			{children}
		</GetGamesContext.Provider>
	);
};
