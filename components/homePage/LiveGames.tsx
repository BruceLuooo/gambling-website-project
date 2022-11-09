import styles from '../../styles/homePage/LiveGames.module.css';
import redCircle from '../../public/redCircle.png';
import Image from 'next/image';

interface LiveGames {
	homeTeam: string;
	awayTeam: string;
	homeTeamScore: number;
	awayTeamScore: number;
}

type Props = {
	liveGames: LiveGames[];
};

export default function LiveGames({ liveGames }: Props) {
	return (
		<div className={styles.container}>
			{liveGames.length !== 0 ? (
				liveGames.map((game, index) => (
					<div key={index} className={styles.gameContainer}>
						<div>
							{game.homeTeamScore !== 0 && (
								<div className={styles.live}>
									<Image src={redCircle} alt={'Live'} width={5} />
									<span className={styles.smallFont}>Live</span>
								</div>
							)}
						</div>
						<div className={styles.teamsAndScores}>
							<div className={styles.teams}>
								<span className={styles.overflow}>{game.homeTeam}</span>
								<span className={styles.overflow}>{game.awayTeam}</span>
							</div>
							<div className={styles.points}>
								<span>{game.homeTeamScore}</span>
								<span>{game.awayTeamScore}</span>
							</div>
						</div>
					</div>
				))
			) : (
				<div className={styles.noLiveGamesLabel}>
					No Live games at the moment
				</div>
			)}
		</div>
	);
}
