import Head from 'next/head';
import styles from '../styles/homePage/Home.module.css';
import { useContext, useEffect, useState } from 'react';
import UpcomingGames from '../components/homePage/UpcomingGames';
import CompletedGames from '../components/homePage/CompletedGames';
import News from '../components/homePage/News';
import axios from 'axios';
import LiveGames from '../components/homePage/LiveGames';
import { GetGamesContext } from '../context/GetGamesContext';

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
interface LiveGame {
	homeTeam: string;
	awayTeam: string;
	homeTeamScore: number;
	awayTeamScore: number;
}

interface GameContext {
	setCompletedGames: Function;
}

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

interface Props {
	upcomingGames: getGames[];
}

export async function getStaticProps() {
	const key = process.env.REACT_APP_LIVE_SPORTS_ODDS_KEY;
	const upcomingGames = {
		method: 'GET',
		url: 'https://odds.p.rapidapi.com/v4/sports/basketball_nba/odds',
		params: {
			regions: 'us',
			oddsFormat: 'decimal',
			markets: 'h2h',
			dateFormat: 'unix',
		},
		headers: {
			'X-RapidAPI-Key': key,
			'X-RapidAPI-Host': 'odds.p.rapidapi.com',
		},
	};

	const res = await axios.request(upcomingGames);
	const data = res.data;

	let information: getGames[] = [];
	data.forEach((data: any) => {
		if (data.bookmakers[0] === undefined) return;

		const milliseconds = data.commence_time * 1000;
		const timeStamp = new Date(milliseconds);
		const date = timeStamp.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});

		information.push({
			id: data.id,
			homeTeam: data.home_team,
			awayTeam: data.away_team,
			startTime: date,
			teamOneOdds: {
				odds:
					data.bookmakers[0].markets[0].outcomes[0].name === data.home_team
						? data.bookmakers[0].markets[0].outcomes[0].price
						: data.bookmakers[0].markets[0].outcomes[1].price,
			},
			teamTwoOdds: {
				odds:
					data.bookmakers[0].markets[0].outcomes[1].name === data.away_team
						? data.bookmakers[0].markets[0].outcomes[1].price
						: data.bookmakers[0].markets[0].outcomes[0].price,
			},
		});
	});

	return {
		props: {
			upcomingGames: information,
		},
	};
}

export default function Home({ upcomingGames }: Props) {
	const { setCompletedGames } = useContext(GetGamesContext) as GameContext;
	const [games, setGames] = useState(true);
	const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
	const [tabs, setTabs] = useState({
		bet: true,
		news: true,
		liveScore: true,
	});

	useEffect(() => {
		if (window.innerWidth < 1283) {
			setTabs({ bet: true, news: false, liveScore: false });
		}

		function reportWindowSize() {
			if (window.innerWidth < 1283) {
				setTabs({ bet: true, news: false, liveScore: false });
			} else {
				setTabs({ bet: true, news: true, liveScore: true });
			}
		}
		window.addEventListener('resize', reportWindowSize);
		//  Cleanup for componentWillUnmount
		return () => window.removeEventListener('resize', reportWindowSize);
	}, []);

	useEffect(() => {
		let completedGames: CompletedGame[] = [];
		let liveGames: LiveGame[] = [];

		const options = {
			method: 'GET',
			url: 'https://odds.p.rapidapi.com/v4/sports/basketball_nba/scores',
			params: { daysFrom: '2', dateFormat: 'unix' },
			headers: {
				'X-RapidAPI-Key': ` 2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9`,
				'X-RapidAPI-Host': 'odds.p.rapidapi.com',
			},
		};

		axios.request(options).then(response => {
			response.data.forEach((data: any) => {
				if (data.completed === false) {
					if (data.scores === null) {
						return;
					} else {
						return liveGames.push({
							homeTeam: data.home_team,
							awayTeam: data.away_team,
							homeTeamScore: data.scores[0].score,
							awayTeamScore: data.scores[1].score,
						});
					}
				}

				completedGames.push({
					id: data.id,
					homeTeam: data.home_team,
					awayTeam: data.away_team,
					homeTeamScore: {
						score: data.scores[0].score || '0',
					},
					awayTeamScore: {
						score: data?.scores[1].score || '0',
					},
					date: convertDate(data.commence_time),
				});
			});
			setCompletedGames(completedGames);
			setLiveGames(liveGames);
		});
	}, [setCompletedGames]);

	const convertDate = (commenceTime: number) => {
		const milliseconds = commenceTime * 1000;
		const timeStamp = new Date(milliseconds);
		const date = timeStamp.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
		return date;
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>NBetsA | Home</title>
				<link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
			</Head>

			<main className={styles.mainContainer}>
				{tabs.liveScore && (
					<section className={styles.liveGames}>
						<LiveGames liveGames={liveGames} />
					</section>
				)}
				<header className={styles.introduction}>
					<span className={styles.introHeader}>
						Basketball Betting Simplified
					</span>
					<p className={styles.introHook}>
						Your ultimate destination to bet on upcoming NBA games. Get the best
						odds and make big profits from the games you bet on!
					</p>
				</header>
				<div className={styles.tabs}>
					<button
						onClick={() =>
							setTabs({ bet: true, news: false, liveScore: false })
						}
					>
						Bet
					</button>
					<button
						onClick={() =>
							setTabs({ bet: false, news: true, liveScore: false })
						}
					>
						News
					</button>
					<button
						onClick={() =>
							setTabs({ bet: false, news: false, liveScore: true })
						}
					>
						Live Score
					</button>
				</div>
				<div className={styles.newsAndGamesContainer}>
					{tabs.bet && (
						<section className={styles.gamesContainer}>
							<div className={styles.layover}>
								<div className={styles.navigationContainer}>
									<div
										className={`${styles.navigation} `}
										onClick={() => setGames(true)}
									>
										Games
									</div>
									<div
										className={`${styles.navigation} `}
										onClick={() => setGames(false)}
									>
										Completed
									</div>
									<span
										className={`${styles.underline} ${
											!games ? styles.active : styles.notActive
										}`}
									/>
								</div>
							</div>

							{games === true ? (
								<UpcomingGames upcomingGames={upcomingGames} />
							) : (
								<CompletedGames />
							)}
						</section>
					)}
					{tabs.news && <News />}
				</div>
			</main>
		</div>
	);
}
