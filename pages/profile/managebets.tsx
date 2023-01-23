import styles from '../../styles/manageBets/ManageBets.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { PersonalInfoContext } from '../../context/personalInfoContext';
import BettingHistory from '../../components/profilePage/bets/BettingHistory';
import DisplayBets from '../../components/profilePage/bets/DisplayBets';
import router from 'next/router';
import { auth } from '../../firebase.config';
import LoadingSpinner from '../../components/LoadingSpinner';
import PersonalStatistics from '../../components/personalStatistics/PersonalStatistics';

interface PersonalInfo {
	personalInfo: {
		name: string;
		balance: number;
	};
	setPersonalInfo: Function;
}

function ManageBets() {
	const [activeOrHistory, setActiveOrHistory] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (!user) {
				return router.push('/');
			} else {
				return setIsLoading(false);
			}
		});
	});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={styles.mainContainer}>
			<Head>
				<title>NBetsA | Profile</title>
				<link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
			</Head>
			<PersonalStatistics />
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
	);
}

export default ManageBets;
