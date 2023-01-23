import React from 'react';
import styles from '../../styles/navbarIcons.module.css';

type Props = {
	children: string;
	setActiveMenu: Function;
	leftIcon: any;
	backToMain: string;
};

function MenuHeader({ children, setActiveMenu, backToMain, leftIcon }: Props) {
	return (
		<div className={styles.menuHeader}>
			<span
				className={`${styles.iconButton} ${styles.iconLeft} `}
				onClick={() => setActiveMenu(`${backToMain}`)}
			>
				{leftIcon}
			</span>
			<span className={styles.headerTitle}>{children}</span>
		</div>
	);
}

export default MenuHeader;
