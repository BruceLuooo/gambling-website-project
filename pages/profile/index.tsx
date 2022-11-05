import styles from '../../styles/profilePage/ProfileHome.module.css';
import Balance from '../../components/profilePage/manageBalance/Balance';
import DisplayBets from '../../components/profilePage/bets/DisplayBets';

export default function ProfileHome() {
	return (
		<div className={styles.mainContainer}>
			<div className={styles.betsContainer}>
				<div className={styles.labelContainer}>
					<span className={styles.label}>Active Bets</span>
					<span className={styles.label}>History</span>
				</div>
				<DisplayBets />
			</div>
			<Balance />
		</div>
	);
}
