import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navbarIcons.module.css';
import Link from 'next/link';
import menu from '../public/hamburger.png';
import { auth, db } from '../firebase.config';
import { useRouter } from 'next/router';
import { PersonalInfoContext } from '../context/personalInfoContext';
import {
	browserSessionPersistence,
	setPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CSSTransition } from 'react-transition-group';
import login from '../public/login.svg';
import logoutButton from '../public/logout.svg';
import clipboard from '../public/clipboard.svg';
import goBack from '../public/goBack.svg';
import avatar from '../public/avatar.svg';
import rightArrow from '../public/rightArrow.svg';
import plus from '../public/plus.svg';
import MenuItemLink from './navbar/MenuItemLink';
import MenuItemNoLink from './navbar/MenuItemNoLink';
import MenuHeader from './navbar/MenuHeader';

interface Context {
	setPersonalInfo: Function;
	personalInfo: {
		name: string;
	};
}

function NavbarIcons() {
	const router = useRouter();
	const { personalInfo, setPersonalInfo } = useContext(
		PersonalInfoContext,
	) as Context;
	const [token, setToken] = useState<string | null>(null);

	const [popup, setPopup] = useState(false);
	const [activeMenu, setActiveMenu] = useState('main');
	const [menuHeight, setMenuHeight] = useState(null);

	function calculateHeight(el: any) {
		const height = el.offsetHeight + 20;
		setMenuHeight(height);
	}

	useEffect(() => {
		setToken(sessionStorage.getItem('token'));
	}, [personalInfo.name]);

	useEffect(() => {
		const handleEvent = () => {
			setPopup(false);
			setActiveMenu('main');
		};

		addEventListener('click', handleEvent);
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
		setActiveMenu('main');
		setPopup(false);
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
				<span>NBetsA</span>
			</Link>
			<div
				className={styles.navItem}
				onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
			>
				<a
					href='#'
					className={styles.iconButton}
					onClick={() => setPopup(!popup)}
				>
					<Image src={menu} alt='image' width={20} />
				</a>
				{popup && (
					<div>
						{token ? (
							<div
								className={styles.dropdownMenu}
								style={{ height: menuHeight! }}
							>
								<CSSTransition
									in={activeMenu === 'main'}
									appear={true}
									timeout={300}
									classNames='menu-primary'
									onEnter={calculateHeight}
									unmountOnExit
								>
									<div className={styles.menu}>
										<MenuItemNoLink
											setActiveMenu={setActiveMenu}
											leftIcon={<Image src={avatar} alt='image' width={20} />}
											rightIcon={
												<Image src={rightArrow} alt='image' width={20} />
											}
										>
											Profile
										</MenuItemNoLink>
										<MenuItemNoLink
											setActiveMenu={setActiveMenu}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											rightIcon={
												<Image src={rightArrow} alt='image' width={20} />
											}
										>
											Guidelines
										</MenuItemNoLink>
										<div className={styles.menuItem} onClick={logout}>
											<span
												className={`${styles.iconButton} ${styles.iconLeft}`}
											>
												<Image src={logoutButton} alt='image' width={20} />
											</span>
											<span>Logout</span>
										</div>
									</div>
								</CSSTransition>
								<CSSTransition
									in={activeMenu === 'Profile'}
									timeout={300}
									classNames='menu-secondary'
									onEnter={calculateHeight}
									unmountOnExit
								>
									<div className={styles.menu}>
										<MenuHeader
											setActiveMenu={setActiveMenu}
											leftIcon={<Image src={goBack} alt='image' width={20} />}
											backToMain={'main'}
										>
											My Profile
										</MenuHeader>
										<MenuItemLink
											link={'/profile/managebalance'}
											leftIcon={<Image src={plus} alt='image' width={20} />}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											Manage Balance
										</MenuItemLink>
										<MenuItemLink
											link={'/profile/managebets'}
											leftIcon={<Image src={plus} alt='image' width={20} />}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											Manage Bets
										</MenuItemLink>
									</div>
								</CSSTransition>
								<CSSTransition
									in={activeMenu === 'Guidelines'}
									appear={true}
									timeout={300}
									classNames='menu-secondary'
									onEnter={calculateHeight}
									unmountOnExit
								>
									<div className={styles.menu}>
										<MenuHeader
											setActiveMenu={setActiveMenu}
											leftIcon={<Image src={goBack} alt='image' width={20} />}
											backToMain={'main'}
										>
											Guidelines
										</MenuHeader>
										<MenuItemLink
											link={'/guidelines/howtoplay'}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											How To Play
										</MenuItemLink>
										<MenuItemLink
											link={'/guidelines/rulesandregulation'}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											Rules & Regulations
										</MenuItemLink>
									</div>
								</CSSTransition>
							</div>
						) : (
							<div
								className={styles.dropdownMenu}
								style={{ height: menuHeight! }}
							>
								<CSSTransition
									in={activeMenu === 'main'}
									appear={true}
									timeout={300}
									classNames='menu-primary'
									onEnter={calculateHeight}
									unmountOnExit
								>
									<div className={styles.menu}>
										<MenuItemLink
											link={'/login'}
											leftIcon={<Image src={login} alt='image' width={20} />}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											Login
										</MenuItemLink>
										<div className={styles.menuItem} onClick={demoLogin}>
											<span
												className={`${styles.iconButton} ${styles.iconLeft}`}
											>
												<Image src={login} alt='image' width={20} />
											</span>
											<span>Demo Login</span>
										</div>
										<MenuItemNoLink
											setActiveMenu={setActiveMenu}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											rightIcon={
												<Image src={rightArrow} alt='image' width={20} />
											}
										>
											Guidelines
										</MenuItemNoLink>
									</div>
								</CSSTransition>
								<CSSTransition
									in={activeMenu === 'Guidelines'}
									appear={true}
									timeout={300}
									classNames='menu-secondary'
									onEnter={calculateHeight}
									unmountOnExit
								>
									<div className={styles.menu}>
										<MenuHeader
											setActiveMenu={setActiveMenu}
											leftIcon={<Image src={goBack} alt='image' width={20} />}
											backToMain={'main'}
										>
											GuideLines
										</MenuHeader>

										<MenuItemLink
											link={'/guidelines/howtoplay'}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											How To Play
										</MenuItemLink>
										<MenuItemLink
											link={'/guidelines/rulesandregulation'}
											leftIcon={
												<Image src={clipboard} alt='image' width={20} />
											}
											setPopup={setPopup}
											setActiveMenu={setActiveMenu}
										>
											Rules & Regulations
										</MenuItemLink>
									</div>
								</CSSTransition>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default NavbarIcons;
