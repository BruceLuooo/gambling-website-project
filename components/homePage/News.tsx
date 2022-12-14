import styles from '../../styles/homePage/News.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import espn from '../../public/espn.png';
import bleacherReport from '../../public/bleacherReport2.png';
import LoadingSpinner from '../LoadingSpinner';

interface News {
	title: string;
	url: string;
	source: string;
}

export default function News() {
	const [news, setNews] = useState<News[]>([]);
	const [newsReporter, setNewsReporter] = useState<string>('espn');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `https://nba-stories.onrender.com/articles?source=${newsReporter}`,
		};

		axios.request(options).then(response => {
			setNews(response.data);

			setLoading(false);
		});
	}, [newsReporter]);

	const changeNewsReporter = (reporter: string) => {
		if (newsReporter === reporter) {
			return;
		} else {
			setLoading(true);
			setNewsReporter(reporter);
		}
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
					onClick={() => changeNewsReporter('bleacher-report')}
				>
					Bleacher Report
				</button>
			</div>
			{!loading ? (
				news.map(data => (
					<a
						key={data.title}
						target='_blank'
						rel='noreferrer'
						href={data.url}
						className={styles.news}
					>
						<span className={styles.newsTitle}>{data.title}</span>
						<Image
							src={newsReporter === 'espn' ? espn : bleacherReport}
							alt='espn'
							width={newsReporter === 'espn' ? 50 : 40}
						/>
					</a>
				))
			) : (
				<LoadingSpinner />
			)}
		</div>
	);
}
