import styles from '../../styles/homePage/CompletedGames.module.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface CompletedGame {
	id: string;
	homeTeam: string;
	awayTeam: string;
	homeTeamScore: {
		score: string;
	};
	awayTeamScore: {
		score: string;
	};
	date: string;
}

type Props = {
	completedGames: CompletedGame[];
};

export default function CompletedGames({ completedGames }: Props) {
	return (
		<div>
			{completedGames.map((game, index) => (
				<div className={styles.displayGameGridContainer} key={index}>
					<span className={styles.date}>{game.date}</span>
					<span className={styles.winnerSentence}>Final Score</span>
					<hr className={`${styles.thinLine} ${styles.thinLineMiddle}`} />
					<hr className={`${styles.thinLine} ${styles.thinLineEnd}`} />
					<div className={styles.teams}>
						<span className={` ${styles.fontSize}`}>{game.homeTeam}</span>
						<span className={styles.dash}>-</span>
						<span className={`${styles.fontSize}`}>{game.awayTeam}</span>
					</div>
					<div className={styles.scoreContainer}>
						<div className={styles.teamPoints}>
							<div className={styles.test}>
								<span className={styles.fontSize}>{game.homeTeam}</span>
							</div>
							<span>{game.homeTeamScore.score}</span>
						</div>
						<div className={styles.teamPoints}>
							<div className={styles.test}>
								<span className={styles.fontSize}>{game.awayTeam}</span>
							</div>
							<span>{game.awayTeamScore.score}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
