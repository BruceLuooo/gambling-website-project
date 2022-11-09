import { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';

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
	setCompletedGames: Function;
	completedGames: CompletedGame[];
};

interface CompletedGame {
	id: string;
	homeTeam: string;
	awayTeam: string;
	homeTeamScore: {
		score: string;
	};
	awayTeamScore: {
		score: string;
	};
	date: string;
}

interface Props {
	children: ReactNode;
}

export const GetGamesContext = createContext<GamesContext | null>(null);

export const GetGamesProvider = ({ children }: Props) => {
	const [upcomingGames, setUpcomingGames] = useState<getGames[]>([]);

	const [completedGames, setCompletedGames] = useState<CompletedGame[]>([]);

	useEffect(() => {
		let information: getGames[] = [];
		const options = {
			method: 'GET',
			url: 'https://odds.p.rapidapi.com/v4/sports/basketball_nba/odds',
			params: {
				regions: 'us',
				oddsFormat: 'decimal',
				markets: 'h2h',
				dateFormat: 'iso',
			},
			headers: {
				'X-RapidAPI-Key': '2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9',
				'X-RapidAPI-Host': 'odds.p.rapidapi.com',
			},
		};
		axios.request(options).then(response => {
			response.data.forEach((data: any) => {
				if (data.bookmakers[0] === undefined) return;

				const date = new Date(data.commence_time);
				const timeStamp = date.getTime();
				const dateCopy = `${new Date(timeStamp)}`;

				information.push({
					id: data.id,
					homeTeam: data.home_team,
					awayTeam: data.away_team,
					startTime: dateCopy,
					teamOneOdds: {
						odds:
							data.bookmakers[0].markets[0].outcomes[0].name === data.home_team
								? data.bookmakers[0].markets[0].outcomes[0].price
								: data.bookmakers[0].markets[0].outcomes[1].price,
					},
					teamTwoOdds: {
						odds:
							data.bookmakers[0].markets[0].outcomes[1].name === data.away_team
								? data.bookmakers[0].markets[0].outcomes[1].price
								: data.bookmakers[0].markets[0].outcomes[0].price,
					},
				});
			});
			setUpcomingGames(information);
		});
	}, []);

	return (
		<GetGamesContext.Provider
			value={{ upcomingGames, setCompletedGames, completedGames }}
		>
			{children}
		</GetGamesContext.Provider>
	);
};
