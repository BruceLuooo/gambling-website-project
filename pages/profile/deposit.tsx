import styles from '../../styles/profilePage/DepositorWidthdraw.module.css';
import React, { useContext, useEffect, useState } from 'react';
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
import { useDepositOrWidthdraw } from '../../hooks/profile/useDepositOrWidthdraw';

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

export default function Deposit() {
	const router = useRouter();
	const { delay, loading, setLoading } = useDelay();

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (!user) {
				return router.push('/');
			} else {
				return setIsLoading(false);
			}
		});
	}, [router]);

	const {
		bankDetails,
		setBankDetails,
		updateBankDetails,
		updateMoneyAmount,
		isFormCompletetd,
		updateCvv,
		updateExpDate,
		updateCardNumber,
	} = useDepositOrWidthdraw();
	const { amount, cardNumber, cvv, expMonth, expYear } = bankDetails;

	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as InfoContext;

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState({ error: false, msg: '' });

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const deposit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isFormCompletetd(bankDetails)) {
			return setError({ error: true, msg: 'Please Check Information' });
		}

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
			cardNumber: cardNumber.slice(15, 19),
		});

		//@ts-ignore
		setPersonalInfo(prev => ({
			...prev,
			balance: personalInfo.balance + amount!,
		}));

		await delay(3000);
		router.push('/profile/managebalance');
	};

	if (loading) {
		return (
			<div className={styles.mainContainer}>
				<LoadingSpinner />
				<span>Please wait while we process the information</span>
			</div>
		);
	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={styles.mainContainer}>
			<Head>
				<title>NBetsA | Deposit </title>
			</Head>

			<section className={styles.navigation}>
				<span>
					<Link href={'/profile/managebalance'}>Manage Balance</Link>
				</span>
				<span>/</span>
				<span>Deposit</span>
			</section>
			<section className={styles.informationContainer}>
				<section className={styles.form}>
					<div>
						<span className={styles.headerLabel}>Balance</span>
						<hr className={styles.underline} />
					</div>
					<span className={styles.balance}>
						{formatter.format(personalInfo.balance)}
					</span>
					<div className={`${styles.layout}`}>
						<label htmlFor='amount'>Deposit Amount</label>
						<input
							type='number'
							placeholder='Enter Amount'
							//@ts-ignore
							value={amount}
							id='amount'
							onChange={updateMoneyAmount}
							required
						/>
					</div>
					<div className={styles.buttonContainer}>
						<button
							type='button'
							onClick={() => setBankDetails(prev => ({ ...prev, amount: 100 }))}
						>
							$100
						</button>
						<button
							type='button'
							onClick={() => setBankDetails(prev => ({ ...prev, amount: 500 }))}
						>
							$500
						</button>
						<button
							type='button'
							onClick={() =>
								setBankDetails(prev => ({ ...prev, amount: 1000 }))
							}
						>
							$1000
						</button>
					</div>
				</section>
				<form className={styles.form} onSubmit={deposit}>
					<div>
						<span className={styles.headerLabel}>Card Detail</span>
						<hr className={styles.underline} />
					</div>
					<div className={`${styles.layout}`}>
						<label htmlFor='name'>Full Name</label>
						<input
							id='name'
							type='text'
							onChange={updateBankDetails}
							required
						/>
					</div>
					<div className={`${styles.layout}`}>
						<label htmlFor='cardNumber'>Card Number</label>
						<input
							id='cardNumber'
							onChange={updateCardNumber}
							value={cardNumber}
							type='text'
							required
						/>
					</div>
					<div className={styles.layoutBottom}>
						<div className={`${styles.layout}`}>
							<label htmlFor='cvv'>cvv</label>
							<input
								id='cvv'
								onChange={updateCvv}
								value={cvv}
								type='number'
								required
							/>
						</div>
						<div className={`${styles.layout}`}>
							<label htmlFor='expirationDate'>Exp. Date</label>
							<div>
								<input
									id='expMonth'
									placeholder='MM'
									onChange={updateExpDate}
									value={expMonth}
									type='number'
									required
								/>
								<input
									id='expYear'
									placeholder='YY'
									onChange={updateExpDate}
									value={expYear}
									type='number'
									required
								/>
							</div>
						</div>
					</div>
					{error.error && <div className={styles.error}>{error.msg}</div>}
					<button className={styles.submitButton} type='submit'>
						Deposit
					</button>
				</form>
			</section>
		</div>
	);
}
