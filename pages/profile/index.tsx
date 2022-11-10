import styles from '../../styles/profilePage/ProfileHome.module.css';
import DisplayBets from '../../components/profilePage/bets/DisplayBets';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import { GetGamesContext } from '../../context/GetGamesContext';
import { useContext, useEffect, useState } from 'react';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	doc,
	setDoc,
	deleteDoc,
	updateDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import Link from 'next/link';
import TransactionHistory from '../../components/profilePage/manageBalance/TransactionHistory';

interface PersonalInfo {
	personalInfo: {
		name: string;
		balance: number;
	};
	setPersonalInfo: Function;
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

interface Transaction {
	date: string;
	amount: number;
	type: string;
}

interface BetHistory {
	betAmount: number;
	estimatedWin: number;
	winningTeam: string;
	losingTeam: string;
	awayTeam: string;
	awayTeamScore: string;
	homeTeam: string;
	homeTeamScore: string;
	winner: string;
}

interface ActiveBets {
	winningTeam: string;
	losingTeam: string;
	betAmount: number;
	payout: number;
}

export default function ProfileHome() {
	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as PersonalInfo;
	const { completedGames } = useContext(GetGamesContext) as CompletedGamesInfo;
	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	useEffect(() => {
		if (window.innerWidth < 1283) {
			setDisplay({ bets: true, funds: false });
		}

		function reportWindowSize() {
			if (window.innerWidth < 1283) {
				setDisplay({ bets: true, funds: false });
			} else {
				setDisplay({ bets: true, funds: true });
			}
		}
		window.addEventListener('resize', reportWindowSize);
		//  Cleanup for componentWillUnmount
		return () => window.removeEventListener('resize', reportWindowSize);
	}, []);
	useEffect(() => {
		const getTransactionHistory = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'deposit-widthdraw',
			);

			const firstPageQuery = query(
				getCollection,
				orderBy('date', 'desc'),
				limit(5),
			);

			const transactionLogRef: Transaction[] = [];

			const docSnap = await getDocs(firstPageQuery);
			docSnap.forEach(doc => {
				return transactionLogRef.push({
					type: doc.data().type,
					date: convertDate(doc.data().date.toDate()),
					amount: doc.data().amount,
				});
			});

			setTransactionHistory(transactionLogRef);
		};
		getTransactionHistory();
	}, []);
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

	useEffect(() => {
		const getActiveBets = async () => {
			const activeBetsLogRef: ActiveBets[] = [];

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
						awayTeamScore: match[0].awayTeamScore.score,
						homeTeam: match[0].homeTeam,
						homeTeamScore: match[0].homeTeamScore.score,
						winner:
							match[0].awayTeamScore.score > match[0].homeTeamScore.score
								? match[0].awayTeam
								: match[0].homeTeam,
						date: serverTimestamp(),
					};
					betHistory.push(data);

					const betWon = data.winningTeam
						.toLowerCase()
						.includes(data.winner.toLowerCase());

					if (betWon) {
						const currentUser = doc(db, 'users', `${auth.currentUser!.uid}`);
						await updateDoc(currentUser, {
							balance: personalInfo.balance + data.estimatedWin,
						});

						//@ts-ignore
						setPersonalInfo(prev => ({
							...prev,
							balance: personalInfo.balance + data.estimatedWin,
						}));
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
							`${document.data().id}`,
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
		};
		getActiveBets();
	}, []);

	const [display, setDisplay] = useState({ bets: true, funds: true });
	const [activeOrHistory, setActiveOrHistory] = useState(true);
	const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
		[],
	);
	const [activeBets, setActiveBets] = useState<ActiveBets[]>([]);
	const [betHistory, setBetHistory] = useState<BetHistory[]>([]);

	return (
		<div className={styles.mainContainer}>
			<span className={styles.welcomeHeader}>Welcome {personalInfo.name}!</span>
			<div className={styles.navigation}>
				<button onClick={() => setDisplay({ bets: true, funds: false })}>
					Bets
				</button>
				<button onClick={() => setDisplay({ bets: false, funds: true })}>
					Funds
				</button>
			</div>
			<div className={styles.layout}>
				{display.bets && (
					<div className={styles.betsContainer}>
						<div className={styles.labelContainer}>
							<span onClick={() => setActiveOrHistory(true)}>Active Bets</span>
							<span onClick={() => setActiveOrHistory(false)}>History</span>
							<span
								className={`${styles.underline} ${
									!activeOrHistory ? styles.active : styles.notActive
								}`}
							/>
						</div>
						<DisplayBets
							activeOrHistory={activeOrHistory}
							activeBets={activeBets}
							betHistory={betHistory}
						/>
					</div>
				)}
				{display.funds && (
					<div className={styles.balanceContainer}>
						<div className={styles.manageBalance}>
							<span>Available Balance</span>
							<span className={styles.balance}>
								{formatter.format(personalInfo.balance)}
							</span>
							<div className={styles.buttonContainer}>
								<Link href={'/profile/deposit'} className={styles.link}>
									<button className={styles.button}>Deposit</button>
								</Link>
								<Link href={'/profile/widthdraw'} className={styles.link}>
									<button className={styles.button}>Widthdraw</button>
								</Link>
							</div>
						</div>
						<TransactionHistory transactionHistory={transactionHistory} />
					</div>
				)}
			</div>
		</div>
	);
}
