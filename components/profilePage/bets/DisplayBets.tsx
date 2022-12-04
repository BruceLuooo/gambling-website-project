import styles from '../../../styles/profilePage/DisplayBets.module.css';
import React, { useContext, useEffect, useState } from 'react';
import {
	collection,
	getDocs,
	serverTimestamp,
	doc,
	updateDoc,
	setDoc,
	deleteDoc,
} from 'firebase/firestore';
import { db, auth } from '../../../firebase.config';
import { GetGamesContext } from '../../../context/GetGamesContext';
import { PersonalInfoContext } from '../../../context/personalInfoContext';
import { onAuthStateChanged } from 'firebase/auth';

interface ActiveBets {
	winningTeam: string;
	losingTeam: string;
	betAmount: number;
	payout: number;
}

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

interface CompletedGamesInfo {
	completedGames: CompletedGame[];
}

interface PersonalInfo {
	personalInfo: {
		name: string;
		balance: number;
	};
	setPersonalInfo: Function;
}

export default function DisplayBets() {
	const formatCurrency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const { completedGames } = useContext(GetGamesContext) as CompletedGamesInfo;
	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as PersonalInfo;

	const [activeBets, setActiveBets] = useState<ActiveBets[]>([]);

	useEffect(() => {
		const getActiveBets = async () => {
			const activeBetsLogRef: ActiveBets[] = [];
			let totalWinning = 0;

			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'placedbets',
			);

			const docSnap = await getDocs(getCollection);

			docSnap.forEach(async document => {
				const match = completedGames.filter(
					game => game.id === document.data().id,
				);

				if (match.length === 1) {
					const data = {
						betAmount: document.data().betAmount,
						estimatedWin: document.data().estimatedWin,
						winningTeam: document.data().winningTeam,
						losingTeam: document.data().losingTeam,
						awayTeam: match[0].awayTeam,
						awayTeamScore: +match[0].awayTeamScore.score,
						homeTeam: match[0].homeTeam,
						homeTeamScore: +match[0].homeTeamScore.score,
						winner:
							+match[0].awayTeamScore.score > +match[0].homeTeamScore.score
								? match[0].awayTeam
								: match[0].homeTeam,
						date: serverTimestamp(),
					};

					const betWon = data.winningTeam
						.toLowerCase()
						.includes(data.winner.toLowerCase());

					if (betWon) {
						totalWinning += data.estimatedWin;
					}

					const docRef = doc(
						db,
						`users/${auth.currentUser?.uid}/betHistory`,
						`${document.data().id}`,
					);
					await setDoc(docRef, data);
					await deleteDoc(
						doc(
							db,
							`users/${auth.currentUser?.uid}/placedbets`,
							`${document.id}`,
						),
					);
				} else {
					return activeBetsLogRef.push({
						winningTeam: document.data().winningTeam,
						losingTeam: document.data().losingTeam,
						betAmount: document.data().betAmount,
						payout: document.data().estimatedWin,
					});
				}
			});

			setActiveBets(activeBetsLogRef);
			if (totalWinning > 0) {
				const currentUser = doc(db, 'users', `${auth.currentUser!.uid}`);
				await updateDoc(currentUser, {
					balance: personalInfo.balance + totalWinning,
				});

				// @ts-ignore
				setPersonalInfo(prev => ({
					...prev,
					balance: personalInfo.balance + totalWinning,
				}));
			}
		};

		onAuthStateChanged(auth, user => {
			if (user) {
				getActiveBets();
			}
		});
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.bettingContainer}>
				{activeBets.map((active, index) => (
					<div className={styles.placedBetsContainer} key={index}>
						<div className={styles.game}>
							<span className={`${styles.winner}`}>{active.winningTeam}</span>
							<span>-</span>
							<span>{active.losingTeam}</span>
						</div>
						<span className={styles.padding}>
							Bet: {formatCurrency.format(active.betAmount)}
						</span>
						<div className={styles.padding}>
							<span>Payout: </span>
							<span className={styles.payout}>
								{formatCurrency.format(active.payout)}
							</span>
						</div>
						<div>
							<hr className={styles.lineSeperator} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
