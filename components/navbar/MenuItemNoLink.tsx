import React from 'react';
import styles from '../../styles/navbarIcons.module.css';

type Props = {
	children: string;
	setActiveMenu: Function;
	leftIcon: any;
	rightIcon?: any;
};

function MenuItemNoLink({
	children,
	setActiveMenu,
	leftIcon,
	rightIcon,
}: Props) {
	return (
		<div
			className={styles.menuItem}
			onClick={() => setActiveMenu(`${children}`)}
		>
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

export default MenuItemNoLink;
