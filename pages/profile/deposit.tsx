import styles from '../../styles/profilePage/DepositorWidthdraw.module.css';
import React, { useContext, useState } from 'react';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import { useRouter } from 'next/router';
import {
	doc,
	updateDoc,
	collection,
	addDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import useDelay from '../../hooks/useDelay';

interface Info {
	name: string;
	lastname: string;
	email: string;
	balance: number;
}

type InfoContext = {
	personalInfo: Info;
};

export default function deposit() {
	const router = useRouter();
	const { delay, loading, setLoading } = useDelay();
	const { personalInfo } = useContext(PersonalInfoContext) as InfoContext;
	const [amount, setAmount] = useState<number>(0);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const setDepositAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.valueAsNumber);
	};

	const deposit = async () => {
		setLoading(true);

		const docRef = doc(db, 'users', `${auth.currentUser!.uid}`);
		await updateDoc(docRef, {
			balance: personalInfo.balance + amount,
		});

		const collectionRef = collection(
			db,
			`users/${auth.currentUser!.uid}/deposit-widthdraw`,
		);
		await addDoc(collectionRef, {
			type: 'Deposit',
			amount: amount,
			date: serverTimestamp(),
		});

		await delay(3000);
		router.push('/profile');
	};

	if (loading) {
		return (
			<div className={styles.mainContainer}>
				<div className={styles.informationContainer}>
					<span>loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.mainContainer}>
			<div className={styles.informationContainer}>
				<span>Deposit</span>
				<span>bank Information</span>
				<input type='number' id='amount' onChange={setDepositAmount} />
				<span>Balance: {formatter.format(personalInfo.balance)}</span>
				<button onClick={deposit}>deposit</button>
			</div>
		</div>
	);
}
