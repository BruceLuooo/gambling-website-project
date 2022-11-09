import styles from '../../styles/homePage/News.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import espn from '../../public/espn.png';
import bleacherReport from '../../public/bleacherReport2.png';

interface News {
	title: string;
	url: string;
	source: string;
}

export default function News() {
	const [news, setNews] = useState<News[]>([]);
	const [newsReporter, setNewsReporter] = useState<string>('espn');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `https://nba-latest-news.p.rapidapi.com/news/source/${newsReporter}`,
			headers: {
				'X-RapidAPI-Key': '2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9',
				'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
			},
		};

		let information: News[] = [];

		axios.request(options).then(response => {
			response.data.forEach((data: News) => {
				information.push({
					title: data.title,
					url: data.url,
					source: data.source,
				});
			});
			setNews(information);
			setLoading(false);
		});
	}, [newsReporter]);

	const changeNewsReporter = (reporter: string) => {
		setLoading(true);
		setNewsReporter(reporter);
	};

	return (
		<div className={styles.container}>
			<span className={styles.newsHeader}>Latest news</span>
			<div className={styles.buttonContainer}>
				<button
					className={styles.button}
					onClick={() => changeNewsReporter('espn')}
				>
					Espn
				</button>
				<button
					className={styles.button}
					onClick={() => changeNewsReporter('bleacher_report')}
				>
					Bleacher Report
				</button>
			</div>
			{!loading &&
				news.map(data => (
					<a target='_blank' href={data.url} className={styles.news}>
						<span className={styles.newsTitle}>{data.title}</span>
						<Image
							src={newsReporter === 'espn' ? espn : bleacherReport}
							alt='espn'
							width={newsReporter === 'espn' ? 50 : 40}
						/>
					</a>
				))}
		</div>
	);
}
