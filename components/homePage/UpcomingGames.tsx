import styles from '../../styles/homePage/UpcomingGames.module.css';
import Link from 'next/link';
import React, { useContext } from 'react';
import { GetGamesContext } from '../../context/GetGamesContext';
import Image from 'next/image';
import nbaLogo from '../../public/nbaLogo.png';

interface getGames {
	id: string;
	homeTeam: string;
	awayTeam: string;
	startTime: string;
	teamOneOdds: {
		odds: number;
	};
	teamTwoOdds: {
		odds: number;
	};
}

type GamesContext = {
	upcomingGames: getGames[];
};

export default function UpcomingGames() {
	const { upcomingGames } = useContext(GetGamesContext) as GamesContext;

	return (
		<div>
			{upcomingGames.map((game, index) => (
				<div className={styles.displayGameGridContainer} key={index}>
					<div className={styles.dateContainer}>
						<span className={`${styles.date} `}>{game.startTime}</span>
					</div>
					<div className={styles.winnerContainer}>
						<span className={styles.winnerSentence}>
							Winner (Incl. Overtime)
						</span>
					</div>
					<hr className={`${styles.thinLine} ${styles.thinLineMiddle}`} />
					<hr className={`${styles.thinLine} ${styles.thinLineEnd}`} />
					<div className={styles.nbaLogo}>
						<Image src={nbaLogo} alt='nbaLogo' width={60} />
					</div>
					<div className={styles.teams}>
						<span className={` ${styles.fontSize}`}>{game.homeTeam}</span>
						<span className={styles.dash}>-</span>
						<span className={`${styles.fontSize}`}>{game.awayTeam}</span>
					</div>
					<div className={styles.buttonContainer}>
						<Link
							className={styles.button}
							href={{ pathname: '/placebet', query: { id: game.id } }}
						>
							<span className={styles.test}>{game.homeTeam}</span>
							<span>{game.teamOneOdds.odds}</span>
						</Link>
						<Link
							className={styles.button}
							href={{ pathname: '/placebet', query: { id: game.id } }}
						>
							<span className={styles.test}>{game.awayTeam}</span>
							<span>{game.teamTwoOdds.odds}</span>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}
