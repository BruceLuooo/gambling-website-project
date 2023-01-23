import React from 'react';
import styles from '../../styles/personalStatistics/PersonalStatistics.module.css';

function personalStatistics() {
	return (
		<div className={styles.mainContainer}>
			<div className={styles.infoContainer}>
				<div>$15000</div>
				<div>Total Amount Bet</div>
			</div>
			<div className={styles.infoContainer}>
				<div>$3000</div>
				<div>Total Winnings</div>
			</div>
			<div className={styles.infoContainer}>
				<div>83</div>
				<div>Total Bets Won</div>
			</div>
			<div className={styles.infoContainer}>
				<div>181</div>
				<div>Total Bets Placed</div>
			</div>
		</div>
	);
}

export default personalStatistics;
