import styles from '../../styles/manageBalance/manageBalance.module.css';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import Link from 'next/link';
import TransactionHistory from '../../components/profilePage/manageBalance/TransactionHistory';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/LoadingSpinner';
import PersonalStatistics from '../../components/personalStatistics/PersonalStatistics';

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
	cardNumber: string;
}

const ManageBalance = () => {
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
					cardNumber: doc.data().cardNumber,
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

			<div className={styles.layout}>
				<div className={styles.manageBalance}>
					<div className={styles.balance}>
						{personalInfo.balance > 0 ? (
							<span>{formatter.format(personalInfo.balance)}</span>
						) : (
							<span>{formatter.format(0)}</span>
						)}
						<span>Available Balance</span>
					</div>
					<div className={styles.buttonContainer}>
						<Link href={'/profile/deposit'} className={styles.link}>
							<span className={styles.button}>Deposit</span>
						</Link>
						<Link href={'/profile/widthdraw'} className={styles.link}>
							<span className={styles.button}>Widthdraw</span>
						</Link>
					</div>
				</div>
				<PersonalStatistics />
				<div className={styles.balanceContainer}>
					<TransactionHistory transactionHistory={transactionHistory} />
				</div>
			</div>
		</div>
	);
};

export default ManageBalance;
