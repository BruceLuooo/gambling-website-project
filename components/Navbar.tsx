import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import Link from 'next/link';
import menu from '../public/hamburger.png';
import logo from '../public/logo4.png';
import { auth, db } from '../firebase.config';
import { useRouter } from 'next/router';
import { PersonalInfoContext } from '../context/personalInfoContext';
import {
	browserSessionPersistence,
	setPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface Context {
	setPersonalInfo: Function;
	personalInfo: {
		name: string;
	};
}

export default function Navbar() {
	const router = useRouter();
	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as Context;
	const [openMenu, setOpenMenu] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		setToken(sessionStorage.getItem('token'));
	}, [personalInfo.name]);

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

	const logout = () => {
		auth.signOut();
		router.push('/');
		sessionStorage.removeItem('token');
		setPersonalInfo({
			name: '',
			lastname: '',
			email: '',
			balance: 0,
		});
		setOpenMenu(false);
	};

	const demoLogin = async () => {
		setPersistence(auth, browserSessionPersistence).then(async () => {
			const { user } = await signInWithEmailAndPassword(
				auth,
				`testing@gmail.com`,
				`testing`,
			);

			if (user) {
				const token = await user.getIdToken();
				sessionStorage.setItem('token', token);

				const docRef = doc(db, 'users', `${auth.currentUser!.uid}`);
				const docSnap = await getDoc(docRef);
				setPersonalInfo({
					name: docSnap.data()!.name,
					lastname: docSnap.data()!.lastname,
					email: docSnap.data()!.email,
					balance: docSnap.data()!.balance,
				});

				router.push('/');
			}
		});
	};

	return (
		<div className={styles.container}>
			<Link href='/'>
				<Image
					src={logo}
					alt={'Logo'}
					className={styles.logo}
					onClick={() => setOpenMenu(false)}
				/>
			</Link>
			{token ? (
				<div className={`${styles.navbar} ${openMenu && styles.open}`}>
					<Link href='/profile'>
						<button
							className={styles.navigation}
							onClick={() => setOpenMenu(false)}
						>
							Profile
						</button>
					</Link>
					<div onClick={logout}>
						<button
							className={styles.navigation}
							onClick={() => setOpenMenu(false)}
						>
							Logout
						</button>
					</div>
				</div>
			) : (
				<div className={`${styles.navbar} ${openMenu && styles.open}`}>
					<Link href='/login'>
						<button
							className={styles.navigation}
							onClick={() => setOpenMenu(false)}
						>
							Login
						</button>
					</Link>
					<button onClick={demoLogin} className={styles.navigation}>
						Demo Login
					</button>
				</div>
			)}
			<Image
				src={menu}
				width={28}
				alt='menu'
				className={styles.menuButton}
				onClick={() => setOpenMenu(!openMenu)}
			/>
		</div>
	);
}
