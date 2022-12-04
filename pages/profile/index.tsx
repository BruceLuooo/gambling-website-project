import styles from '../../styles/profilePage/ProfileHome.module.css';
import DisplayBets from '../../components/profilePage/bets/DisplayBets';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import Link from 'next/link';
import TransactionHistory from '../../components/profilePage/manageBalance/TransactionHistory';
import BettingHistory from '../../components/profilePage/bets/BettingHistory';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/LoadingSpinner';

interface PersonalInfo {
	personalInfo: {
		name: string;
		balance: number;
	};
	setPersonalInfo: Function;
}

interface Transaction {
	date: string;
	amount: number;
	type: string;
}

const ProfileHome = () => {
	const { personalInfo } = useContext(PersonalInfoContext) as PersonalInfo;
	const router = useRouter();
	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const [isLoading, setIsLoading] = useState(true);
	const [display, setDisplay] = useState({ bets: true, funds: true });
	const [activeOrHistory, setActiveOrHistory] = useState(true);
	const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
		[],
	);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (!user) {
				return router.push('/');
			} else {
				return setIsLoading(false);
			}
		});
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
			const transactionLogRef: Transaction[] = [];

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

		onAuthStateChanged(auth, user => {
			if (user) {
				getTransactionHistory();
			}
		});
	}, []);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={styles.mainContainer}>
			<Head>
				<title>NBetsA | Profile</title>
				<link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
			</Head>

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
						{activeOrHistory ? (
							<div>
								<DisplayBets />
							</div>
						) : (
							<div>
								<BettingHistory />
							</div>
						)}
					</div>
				)}
				{display.funds && (
					<div className={styles.balanceContainer}>
						<div className={styles.manageBalance}>
							<span>Available Balance</span>
							{personalInfo.balance > 0 ? (
								<span className={styles.balance}>
									{formatter.format(personalInfo.balance)}
								</span>
							) : (
								<span className={styles.balance}>{formatter.format(0)}</span>
							)}
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
};

export default ProfileHome;
