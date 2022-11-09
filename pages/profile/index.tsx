import styles from '../../styles/profilePage/ProfileHome.module.css';
import DisplayBets from '../../components/profilePage/bets/DisplayBets';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import Link from 'next/link';
import TransactionHistory from '../../components/profilePage/manageBalance/TransactionHistory';

interface Context {
	personalInfo: {
		name: string;
		balance: number;
	};
}

interface Transaction {
	date: string;
	amount: number;
	type: string;
}

interface ActiveBets {
	winningTeam: string;
	losingTeam: string;
	betAmount: number;
	payout: number;
}

export default function ProfileHome() {
	const { personalInfo } = useContext(PersonalInfoContext) as Context;
	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const [display, setDisplay] = useState({ bets: true, funds: true });
	const [activeOrHistory, setActiveOrHistory] = useState(true);
	const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
		[],
	);
	const [activeBets, setActiveBets] = useState<ActiveBets[]>([]);

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
		const getActiveBets = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'placedbets',
			);

			const activeBetsLogRef: ActiveBets[] = [];

			const docSnap = await getDocs(getCollection);
			docSnap.forEach(doc => {
				return activeBetsLogRef.push({
					winningTeam: doc.data().winningTeam,
					losingTeam: doc.data().losingTeam,
					betAmount: doc.data().betAmount,
					payout: doc.data().estimatedWin,
				});
			});

			setActiveBets(activeBetsLogRef);
		};
		getActiveBets();
	}, []);

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
