import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../../styles/profilePage/Balance.module.css';
import TransactionHistory from './TransactionHistory';
import { PersonalInfoContext } from '../../../context/personalInfoContext';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../../firebase.config';

interface Info {
	name: string;
	lastname: string;
	email: string;
	balance: number;
}

type InfoContext = {
	personalInfo: Info;
};

interface Transaction {
	date: string;
	amount: number;
	type: string;
}

export default function Balance() {
	const { personalInfo } = useContext(PersonalInfoContext) as InfoContext;

	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
		[],
	);

	useEffect(() => {
		const getTransactionHistory = async () => {
			const getCollection = collection(
				db,
				`users/${auth.currentUser?.uid}/deposit-widthdraw`,
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

	return (
		<div className={styles.container}>
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
	);
}
