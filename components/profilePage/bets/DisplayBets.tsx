import styles from '../../../styles/profilePage/DisplayBets.module.css';
import React from 'react';

export default function DisplayBets() {
	return (
		<div>
			<div className={styles.container}>
				<span>Washington Wizards (1.72) - Toronto Raptors (2.3)</span>
				<span>Wager: $132.42</span>
				<span>Payout: $255.32</span>
				<div></div>
			</div>
		</div>
	);
}
