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
import Link from 'next/link';
import LoadingSpinner from '../../components/LoadingSpinner';
import Head from 'next/head';

interface Info {
	name: string;
	lastname: string;
	email: string;
	balance: number;
}

type InfoContext = {
	personalInfo: Info;
	setPersonalInfo: Function;
};

export default function deposit() {
	const router = useRouter();
	const { delay, loading, setLoading } = useDelay();
	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as InfoContext;
	const [amount, setAmount] = useState<number>();

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
			balance: personalInfo.balance + amount!,
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

		//@ts-ignore
		setPersonalInfo(prev => ({
			...prev,
			balance: personalInfo.balance + amount!,
		}));

		await delay(3000);
		router.push('/profile');
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
				<title>BetScore | Deposit </title>
			</Head>

			<div className={styles.navigation}>
				<span>
					<Link href={'/profile'}>profile</Link>
				</span>
				<span>/</span>
				<span>Deposit</span>
			</div>
			<div className={styles.informationContainer}>
				<div className={styles.form}>
					<div>
						<span className={styles.headerLabel}>Balance</span>
						<hr className={styles.underline} />
					</div>
					<span className={styles.balance}>
						{personalInfo.balance === 0 ? (
							<LoadingSpinner />
						) : (
							formatter.format(personalInfo.balance)
						)}
					</span>
					<div className={`${styles.layout}`}>
						<label htmlFor='amount'>Deposit Amount</label>
						<input
							type='number'
							placeholder='Enter Amount'
							value={amount}
							id='amount'
							onChange={setDepositAmount}
						/>
					</div>
					<div className={styles.buttonContainer}>
						<button type='button' onClick={() => setAmount(100)}>
							$100
						</button>
						<button type='button' onClick={() => setAmount(500)}>
							$500
						</button>
						<button type='button' onClick={() => setAmount(1000)}>
							$1000
						</button>
					</div>
				</div>
				<form className={styles.form} onSubmit={deposit}>
					<div>
						<span className={styles.headerLabel}>Card Detail</span>
						<hr className={styles.underline} />
					</div>
					<div className={`${styles.layout}`}>
						<label htmlFor='name'>Full Name</label>
						<input id='name' type='text' />
					</div>
					<div className={`${styles.layout}`}>
						<label htmlFor='cardNumber'>Card Number</label>
						<input
							id='cardNumber'
							type='tel'
							required
							maxLength={16}
							minLength={16}
						/>
					</div>
					<div className={styles.layoutBottom}>
						<div className={`${styles.layout}`}>
							<label htmlFor='cvv'>cvv</label>
							<input id='cvv' type='tel' maxLength={3} minLength={3} />
						</div>
						<div className={`${styles.layout}`}>
							<label htmlFor='expirationDate'>Exp. Date</label>
							<div>
								<input
									id='expirationDate'
									placeholder='MM'
									type='tel'
									maxLength={2}
									minLength={2}
								/>
								<input
									id='expirationDate'
									placeholder='YY'
									type='tel'
									maxLength={2}
									minLength={2}
								/>
							</div>
						</div>
					</div>
					<button className={styles.submitButton} type='submit'>
						Deposit
					</button>
				</form>
			</div>
		</div>
	);
}
