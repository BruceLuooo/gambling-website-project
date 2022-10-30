import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { GetGamesContext } from '../../context/GetGamesContext';

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

export default function Placebet() {
	const { upcomingGames } = useContext(GetGamesContext) as GamesContext;

	const [gameData, setGameData] = useState<getGames>();

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const id = urlParams.get('id');

		const find = upcomingGames.find(data => data.id === id);

		setGameData(find);
	});

	return (
		<div>
			<p>hi</p>
			<Link href='/'>Go Back To Home Page</Link>
		</div>
	);
}
