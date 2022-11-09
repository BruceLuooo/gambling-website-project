import styles from '../../styles/homePage/CompletedGames.module.css';
import Image from 'next/image';
import nbaLogo from '../../public/nbaLogo.png';

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
					<div className={styles.dateContainer}>
						<span className={styles.date}>{game.date}</span>
					</div>
					<span className={styles.winnerSentence}>Final Score</span>
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
					<div className={styles.scoreContainer}>
						<div className={`${styles.teamPoints} `}>
							<span className={styles.test}>{game.homeTeam}</span>
							<span>{game.homeTeamScore.score}</span>
						</div>
						<div className={`${styles.teamPoints}`}>
							<span className={styles.test}>{game.awayTeam}</span>
							<span>{game.awayTeamScore.score}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
