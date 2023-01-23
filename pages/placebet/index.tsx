import styles from '../../styles/Placebet.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { GetGamesContext } from '../../context/GetGamesContext';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import backArrow from '../../public/backArrow.png';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import useDelay from '../../hooks/useDelay';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/LoadingSpinner';
import Head from 'next/head';
import { usePlaceBets } from '../../hooks/placeBets/usePlaceBets';

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

export default function Placebet() {
	const router = useRouter();
	const { delay, loading, setLoading } = useDelay();
	const { placeBet, selectedWinningTeam, setPlacedBetInfo, placedBetInfo } =
		usePlaceBets();
	const { winningTeam, odd, betAmount } = placedBetInfo;

	const formatCurrency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const { upcomingGames } = useContext(GetGamesContext) as GamesContext;
	const { personalInfo, removeFromBalance } = useContext(
		PersonalInfoContext,
	) as InfoContext;

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const id = urlParams.get('id');
		const find = upcomingGames.find(data => data.id === id);
		if (find) {
			setGameData(find);
			setPlacedBetInfo(prev => ({
				...prev,
				id: find.id,
			}));
		}
	}, [upcomingGames, setPlacedBetInfo]);

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
	const { homeTeam, awayTeam, startTime, teamOneOdds, teamTwoOdds } = gameData;

	const submitBet = async () => {
		setLoading(true);

		setPlacedBetInfo(prev => ({
			...prev,
			estimatedWin: betAmount * odd,
		}));

		try {
			const docRef = collection(
				db,
				`/users/${auth.currentUser!.uid}/placedbets`,
			);

			await addDoc(docRef, placedBetInfo);

			removeFromBalance(betAmount);
			await delay(3000);
			router.push('/profile/managebets');
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
			<Head>
				<title>
					{gameData.homeTeam} - {gameData.awayTeam}
				</title>
			</Head>

			<main className={styles.bettingContainer}>
				<Link href='/'>
					<Image
						src={backArrow}
						alt={'goBack'}
						width={16}
						className={styles.backArrow}
					/>
				</Link>
				<section className={styles.header}>
					<span className={styles.game}>
						{homeTeam} - {awayTeam}
					</span>
					<span className={styles.date}>{startTime}</span>
				</section>
				<section className={styles.odds}>
					<div
						className={`${styles.teamOdds} ${
							winningTeam === homeTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam({
								winningTeam: homeTeam,
								winningOdds: teamOneOdds.odds,
								losingTeam: awayTeam,
								losingOdds: teamTwoOdds.odds,
							})
						}
					>
						<span className={styles.overflow}>{homeTeam}</span>
						<span>{teamOneOdds.odds}</span>
					</div>
					<div
						className={`${styles.teamOdds} ${
							winningTeam === awayTeam && styles.selected
						}`}
						onClick={() =>
							selectedWinningTeam({
								winningTeam: awayTeam,
								winningOdds: teamTwoOdds.odds,
								losingTeam: homeTeam,
								losingOdds: teamOneOdds.odds,
							})
						}
					>
						<span className={styles.overflow}>{awayTeam}</span>
						<span>{teamTwoOdds.odds}</span>
					</div>
				</section>
				<section className={styles.placeBetContainer}>
					<span className={styles.titleLabel}>Winner (Incl. Overtime)</span>
					<span className={styles.winnerLabel}>
						{placedBetInfo.winningTeam === ''
							? 'Select Team'
							: placedBetInfo.winningTeam}
					</span>
					<span className={styles.oddsLabel}>{placedBetInfo.odd}</span>
					<div className={styles.placedBet}>
						<div className={styles.enterAmount}>
							<input
								type='number'
								placeholder='Bet Amount'
								id='betAmount'
								onChange={placeBet}
							/>
							<span className={styles.dollarSign}>$</span>
						</div>
						<div className={styles.estimatedAmount}>
							<span>Est. Payout</span>
							<div>
								<span>$</span>
								<span>
									{betAmount === 0 ? 0 : (betAmount * odd).toFixed(2)}
								</span>
							</div>
						</div>
						<span className={styles.balance}>
							Balance: {formatCurrency.format(personalInfo.balance)}
						</span>
					</div>
				</section>
				<button
					className={styles.placeBet}
					disabled={
						//@ts-ignore
						betAmount === '' ||
						betAmount === 0 ||
						betAmount > personalInfo.balance ||
						winningTeam === ''
					}
					onClick={submitBet}
				>
					{personalInfo.name === '' ? 'Login To Place Bet' : 'Place Bet'}
				</button>
			</main>
		</div>
	);
}
