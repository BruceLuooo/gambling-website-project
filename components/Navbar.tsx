import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import Link from 'next/link';
import menu from '../public/hamburger.png';
import logo from '../public/logo.png';
import { auth } from '../firebase.config';
import { useRouter } from 'next/router';

export default function Navbar() {
	const [openMenu, setOpenMenu] = useState(false);

	const router = useRouter();

	const logout = () => {
		auth.signOut();
		localStorage.removeItem('token');
		router.push('/');
		setOpenMenu(false);
	};

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
			<Link href='/' className={styles.logo}>
				<Image src={logo} alt={'Logo'} width={80} />
				<span>BetScore</span>
			</Link>
			<div className={`${styles.navbar} ${openMenu && styles.open}`}>
				<Link href='/login' className={styles.navigation}>
					Login
				</Link>
				<Link href='/profile' className={styles.navigation}>
					Profile
				</Link>
				<div onClick={logout} className={styles.navigation}>
					Logout
				</div>
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
