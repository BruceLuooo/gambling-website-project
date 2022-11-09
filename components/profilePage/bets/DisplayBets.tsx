import styles from '../../../styles/profilePage/DisplayBets.module.css';
import React from 'react';

interface ActiveBets {
	winningTeam: string;
	losingTeam: string;
	betAmount: number;
	payout: number;
}

interface Props {
	activeOrHistory: boolean;
	activeBets: ActiveBets[];
}

export default function DisplayBets({ activeOrHistory, activeBets }: Props) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return (
		<div className={styles.container}>
			{activeOrHistory && (
				<div>
					{activeBets.map((active, index) => (
						<div className={styles.placedBetsContainer} key={index}>
							<div className={styles.game}>
								<span className={`${styles.winner}`}>{active.winningTeam}</span>
								<span>-</span>
								<span>{active.losingTeam}</span>
							</div>
							<span className={styles.padding}>
								Bet: {formatter.format(active.betAmount)}
							</span>
							<div className={styles.padding}>
								<span>Payout: </span>
								<span className={styles.payout}>
									{formatter.format(active.payout)}
								</span>
							</div>
							<div>
								<hr className={styles.lineSeperator} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
