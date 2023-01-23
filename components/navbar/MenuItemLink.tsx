import React from 'react';
import styles from '../../styles/navbarIcons.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
	children: string;
	link: string;
	leftIcon: any;
	rightIcon?: any;
	setPopup: Function;
	setActiveMenu: Function;
};

function MenuItemLink({
	children,
	link,
	leftIcon,
	rightIcon,
	setPopup,
	setActiveMenu,
}: Props) {
	const router = useRouter();

	const navigate = () => {
		setPopup(false);
		router.push(`${link}`);
		setActiveMenu('main');
	};

	return (
		<div onClick={navigate} className={styles.menuItem}>
			<span className={`${styles.iconButton} ${styles.iconLeft}`}>
				{leftIcon}
			</span>
			<span>{children}</span>
			<span className={`${styles.iconButton} ${styles.iconRight}`}>
				{rightIcon}
			</span>
		</div>
	);
}

export default MenuItemLink;
