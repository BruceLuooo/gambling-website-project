import styles from '../../styles/Placebet.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { GetGamesContext } from '../../context/GetGamesContext';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import backArrow from '../../public/backArrow.svg';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import useDelay from '../../hooks/useDelay';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/LoadingSpinner';

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

interface Info {
	name: string;
	lastname: string;
	email: string;
	balance: number;
}

type InfoContext = {
	personalInfo: Info;
	removeFromBalance: Function;
};

interface PlaceBet {
	id: string | undefined;
	winningTeam: string | undefined;
	odd: number;
	betAmount: number;
	estimatedWin: number;
}

export default function Placebet() {
	const { upcomingGames } = useContext(GetGamesContext) as GamesContext;
	const { personalInfo, removeFromBalance } = useContext(
		PersonalInfoContext,
	) as InfoContext;
	const { delay, loading, setLoading } = useDelay();
	const router = useRouter();

	const currentTime = new Date();
	const convertDate = (timeStamp: string) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

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
		id: '',
		winningTeam: '',
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
			setPlacedBet(prev => ({
				...prev,
				id: find.id,
			}));
		}
	}, [upcomingGames]);

	const selectedWinningTeam = (
		winningTeam: string,
		winningOdds: number,
		losingTeam: string,
		losingOdds: number,
	) => {
		setPlacedBet(prev => ({
			...prev,
			winningTeam: `${winningTeam} (${winningOdds})`,
			losingTeam: `${losingTeam} (${losingOdds})`,
			odd: winningOdds,
		}));
	};

	const betAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPlacedBet(prev => ({
			...prev,
			[e.target.id]: e.target.valueAsNumber,
			estimatedWin: e.target.valueAsNumber * placedBet.odd,
		}));
	};

	const submitBet = async () => {
		setLoading(true);

		try {
			const docRef = doc(
				db,
				`/users/${auth.currentUser!.uid}/placedbets`,
				`${placedBet.id}`,
			);

			await setDoc(docRef, placedBet);

			removeFromBalance(placedBet.betAmount);
			await delay(3000);
			router.push('/profile');
		} catch (error) {
			console.log(error);
		}
	};

	if (loading) {
		return (
			<div className={styles.mainContainer}>
				<LoadingSpinner />
				<span>Please wait while we process the information</span>
			</div>
		);
	}

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
						{gameData.homeTeam} - {gameData.awayTeam}
					</span>
					<span className={styles.date}>
						{gameData.startTime < `${currentTime}`
							? 'Game In Progress'
							: convertDate(gameData.startTime)}
					</span>
				</div>
				<div className={styles.odds}>
					<div
						className={`${styles.teamOdds} ${
							placedBet.winningTeam === gameData.homeTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam(
								gameData.homeTeam,
								gameData.teamOneOdds.odds,
								gameData.awayTeam,
								gameData.teamTwoOdds.odds,
							)
						}
					>
						<span className={styles.overflow}>{gameData.homeTeam}</span>
						<span>{gameData.teamOneOdds.odds}</span>
					</div>
					<div
						className={`${styles.teamOdds} ${
							placedBet.winningTeam === gameData.awayTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam(
								gameData.awayTeam,
								gameData.teamTwoOdds.odds,
								gameData.homeTeam,
								gameData.teamOneOdds.odds,
							)
						}
					>
						<span className={styles.overflow}>{gameData.awayTeam}</span>
						<span>{gameData.teamTwoOdds.odds}</span>
					</div>
				</div>
				<div className={styles.placeBetContainer}>
					<span className={styles.titleLabel}>Winner (Incl. Overtime)</span>
					<span className={styles.winnerLabel}>
						{placedBet.winningTeam === ''
							? 'Select Team'
							: placedBet.winningTeam}
					</span>
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
						<span className={styles.balance}>
							Balance: {formatter.format(personalInfo.balance)}
						</span>
					</div>
				</div>
				<button
					className={styles.placeBet}
					disabled={
						//@ts-ignore
						placedBet.betAmount === '' ||
						placedBet.betAmount === 0 ||
						placedBet.betAmount > personalInfo.balance ||
						placedBet.winningTeam === '' ||
						gameData.startTime < `${currentTime}`
							? true
							: false
					}
					onClick={submitBet}
				>
					{gameData.startTime < `${currentTime}`
						? 'Bets are Closed'
						: 'Place Bet'}
				</button>
			</div>
		</div>
	);
}
