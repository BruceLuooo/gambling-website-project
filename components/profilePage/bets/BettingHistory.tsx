import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase.config';
import styles from '../../../styles/profilePage/DisplayBets.module.css';

interface BetHistory {
	betAmount: number;
	estimatedWin: number;
	winningTeam: string;
	losingTeam: string;
	awayTeam: string;
	awayTeamScore: number;
	homeTeam: string;
	homeTeamScore: number;
	winner: string;
}

export default function BettingHistory() {
	const formatCurrency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const [betHistory, setBetHistory] = useState<BetHistory[]>([]);

	useEffect(() => {
		const getBettingHistory = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'betHistory',
			);

			const q = query(getCollection, orderBy('date', 'desc'));

			const betHistoryLogRef: BetHistory[] = [];

			const docSnap = await getDocs(q);
			docSnap.forEach(doc => {
				return betHistoryLogRef.push({
					awayTeam: doc.data().awayTeam,
					awayTeamScore: doc.data().awayTeamScore,
					betAmount: doc.data().betAmount,
					estimatedWin: doc.data().estimatedWin,
					homeTeam: doc.data().homeTeam,
					homeTeamScore: doc.data().homeTeamScore,
					losingTeam: doc.data().losingTeam,
					winningTeam: doc.data().winningTeam,
					winner: doc.data().winner,
				});
			});

			setBetHistory(betHistoryLogRef);
		};

		getBettingHistory();
	}, []);

	return (
		<div className={styles.bettingContainer}>
			{betHistory.map((bet, index) => (
				<div
					className={`${styles.placedBetsContainer} ${
						bet.winningTeam.toLowerCase().includes(bet.winner.toLowerCase())
							? styles.green
							: styles.red
					}`}
					key={index}
				>
					<div className={styles.game}>
						<span className={`${styles.winner}`}>{bet.winningTeam}</span>
						<span>-</span>
						<span>{bet.losingTeam}</span>
					</div>
					<span className={styles.padding}>
						Bet: {formatCurrency.format(bet.betAmount)}
					</span>
					<div className={styles.padding}>
						<span>Payout: </span>
						<span>{formatCurrency.format(bet.estimatedWin)}</span>
					</div>
					<div>
						<hr className={styles.lineSeperator} />
					</div>
				</div>
			))}
		</div>
	);
}
