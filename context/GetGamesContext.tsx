import { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import Home from '../pages';

interface getGames {
	id: string;
	homeTeam: string;
	awayTeam: string;
	startTime: string;
	teamOneOdds: {
		odds: number;
	};
	teamTwoOdds: {
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
		let information: any[] = [];
		const options = {
			method: 'GET',
			url: 'https://odds.p.rapidapi.com/v4/sports/basketball_nba/odds',
			params: {
				regions: 'us',
				oddsFormat: 'decimal',
				markets: 'h2h',
				dateFormat: 'unix',
			},
			headers: {
				'X-RapidAPI-Key': '2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9',
				'X-RapidAPI-Host': 'odds.p.rapidapi.com',
			},
		};
		const getUpcomingGames = async () => {
			await axios.request(options).then(response => {
				response.data.forEach((data: any) => {
					const milliseconds = data.commence_time * 1000;
					const timeStamp = new Date(milliseconds);
					const date = timeStamp.toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					});

					console.log(date);

					const currentTime = new Date();
					const currentTimeString = currentTime.toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					});

					information.push({
						id: data.id,
						homeTeam: data.home_team,
						awayTeam: data.away_team,
						startTime: date > currentTimeString ? date : 'Live',
						teamOneOdds: {
							odds: data.bookmakers[0].markets[0].outcomes[0].price,
						},
						teamTwoOdds: {
							odds: data.bookmakers[0].markets[0].outcomes[1].price,
						},
					});
					setUpcomingGames(information);
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
