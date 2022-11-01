import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import Link from 'next/link';
import menu from '../public/hamburger.png';
import logo from '../public/logo.png';

export default function Navbar() {
	const [openMenu, setOpenMenu] = useState(false);

	useEffect(() => {
		function reportWindowSize() {
			if (window.innerWidth > 768) {
				setOpenMenu(false);
			}
		}
		window.addEventListener('resize', reportWindowSize);
		//  Cleanup for componentWillUnmount
		return () => window.removeEventListener('resize', reportWindowSize);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.logo}>
				<Image src={logo} alt={'Logo'} width={80} />
				<Link href='/'>BetScore</Link>
			</div>
			<div className={`${styles.navbar} ${openMenu && styles.open}`}>
				<Link href='/myBets' className={styles.navigation}>
					My Bets
				</Link>
				<Link href='/news' className={styles.navigation}>
					News
				</Link>
				<Link href='/login' className={styles.navigation}>
					Login
				</Link>
			</div>
			<Image
				src={menu}
				alt='menu'
				className={styles.menuButton}
				onClick={() => setOpenMenu(!openMenu)}
			/>
		</div>
	);
}
