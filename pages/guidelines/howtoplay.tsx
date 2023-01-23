import React from 'react';
import styles from '../../styles/guidelines/Guidelines.module.css';

function Howtoplay() {
	const dummyText = `id cursus metus aliquam eleifend mi in nulla posuere sollicitudin
  aliquam ultrices sagittis orci a scelerisque purus semper eget duis at
  tellus at urna condimentum mattis pellentesque id nibh tortor id
  aliquet lectus proin nibh nisl condimentum id venenatis a condimentum
  vitae sapien pellentesque habitant morbi tristique senectus et netus`;

	return (
		<div className={styles.rulesAndRegulationContainer}>
			<div className={styles.header}>How To Play</div>
			<div>
				<div className={styles.textHeader}>How To Place Bets</div>
				<article className={styles.text}>{dummyText}</article>
			</div>
			<div>
				<div className={styles.textHeader}>How To Deposit Money</div>
				<article className={styles.text}>{dummyText}</article>
			</div>
			<div>
				<div className={styles.textHeader}>How To Withdraw Money</div>
				<article className={styles.text}>{dummyText}</article>
			</div>
			<div>
				<div className={styles.textHeader}>Do I Need An Account?</div>
				<article className={styles.text}>{dummyText}</article>
			</div>
		</div>
	);
}

export default Howtoplay;
