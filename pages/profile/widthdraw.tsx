import styles from '../../styles/profilePage/DepositorWidthdraw.module.css';
import React, { useContext, useState } from 'react';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import {
	doc,
	updateDoc,
	collection,
	addDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { useRouter } from 'next/router';
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

export default function widthdraw() {
	const router = useRouter();
	const { delay, loading, setLoading } = useDelay();
	const { personalInfo } = useContext(PersonalInfoContext) as InfoContext;
	const [amount, setAmount] = useState<number>(0);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const setWidthdrawAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.valueAsNumber);
	};

	const widthdraw = async () => {
		setLoading(true);

		const docRef = doc(db, 'users', `${auth.currentUser!.uid}`);
		await updateDoc(docRef, {
			balance: personalInfo.balance - amount,
		});

		const collectionRef = collection(
			db,
			`users/${auth.currentUser!.uid}/deposit-widthdraw`,
		);
		await addDoc(collectionRef, {
			type: 'Widthdraw',
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
				<span>Widthdraw</span>
				<span>bank Information</span>
				<input type='number' id='amount' onChange={setWidthdrawAmount} />
				<span>Balance: {formatter.format(personalInfo.balance)}</span>
				<button onClick={widthdraw}>Widthdraw</button>
			</div>
		</div>
	);
}
