import styles from '../../styles/Placebet.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { GetGamesContext } from '../../context/GetGamesContext';
import backArrow from '../../public/backArrow.svg';

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

interface PlaceBet {
	id: string | undefined;
	team: string | undefined;
	odd: number;
	betAmount: number;
	estimatedWin: number;
}

export default function Placebet() {
	const { upcomingGames } = useContext(GetGamesContext) as GamesContext;

	const [gameData, setGameData] = useState<getGames>({
		id: '',
		homeTeam: '',
		awayTeam: '',
		startTime: '',
		teamOneOdds: {
			odds: 0,
		},
		teamTwoOdds: {
			odds: 0,
		},
	});
	const [placedBet, setPlacedBet] = useState<PlaceBet>({
		id: gameData.id,
		team: '',
		odd: 0,
		betAmount: 0,
		estimatedWin: 0,
	});

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const id = urlParams.get('id');

		const find = upcomingGames.find(data => data.id === id);

		if (find) {
			setGameData(find);
		}
	});

	const selectedWinningTeam = (team: string, odds: number) => {
		setPlacedBet(prev => ({
			...prev,
			team: team,
			odd: odds,
		}));
	};

	const betAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPlacedBet(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<div className={styles.mainContainer}>
			<div className={styles.bettingContainer}>
				<Link href='/'>
					<Image
						src={backArrow}
						alt={'goBack'}
						width={50}
						className={styles.backArrow}
					/>
				</Link>
				<div className={styles.header}>
					<span className={styles.game}>
						{gameData?.homeTeam} - {gameData?.awayTeam}
					</span>
					<span className={styles.date}>{gameData?.startTime}</span>
				</div>
				<div className={styles.odds}>
					<div
						className={`${styles.teamOdds} ${
							placedBet.team === gameData.homeTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam(gameData.homeTeam, gameData.teamOneOdds.odds)
						}
					>
						<span>{gameData.homeTeam}</span>
						<span>{gameData.teamOneOdds.odds}</span>
					</div>
					<div
						className={`${styles.teamOdds} ${
							placedBet.team === gameData.awayTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam(gameData.awayTeam, gameData.teamTwoOdds.odds)
						}
					>
						<span>{gameData.awayTeam}</span>
						<span>{gameData.teamTwoOdds.odds}</span>
					</div>
				</div>
				<div className={styles.placeBetContainer}>
					<span className={styles.titleLabel}>Winner (Incl. Overtime)</span>
					<span className={styles.winnerLabel}>{placedBet.team}</span>
					<span className={styles.oddsLabel}>{placedBet.odd}</span>
					<div className={styles.placedBet}>
						<div className={styles.enterAmount}>
							<input
								type='number'
								placeholder='Bet Amount'
								id='betAmount'
								onChange={betAmount}
							/>
							<span className={styles.dollarSign}>$</span>
						</div>
						<div className={styles.estimatedAmount}>
							<span>Est. Payout</span>
							<div>
								<span>$</span>
								<span>
									{placedBet.betAmount === 0
										? 0
										: (placedBet.betAmount * placedBet.odd).toFixed(2)}
								</span>
							</div>
						</div>
						<span className={styles.balance}>Balance: $2343</span>
					</div>
				</div>
				<button
					className={styles.placeBet}
					disabled={
						placedBet.betAmount === '' ||
						placedBet.betAmount === 0 ||
						placedBet.team === ''
							? true
							: false
					}
				>
					Place Bet
				</button>
			</div>
		</div>
	);
}
