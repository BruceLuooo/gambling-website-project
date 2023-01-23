import React from 'react';
import styles from '../../styles/guidelines/Guidelines.module.css';

function Rulesandregulation() {
	const dummyText = `id cursus metus aliquam eleifend mi in nulla posuere sollicitudin
  aliquam ultrices sagittis orci a scelerisque purus semper eget duis at
  tellus at urna condimentum mattis pellentesque id nibh tortor id
  aliquet lectus proin nibh nisl condimentum id venenatis a condimentum
  vitae sapien pellentesque habitant morbi tristique senectus et netus`;

	return (
		<div className={styles.rulesAndRegulationContainer}>
			<div className={styles.header}>Rules And Regulation</div>
			<div>
				<article className={styles.text}>1: {dummyText}</article>
			</div>
			<div>
				<article className={styles.text}>2: {dummyText}</article>
			</div>
			<div>
				<article className={styles.text}>3: {dummyText}</article>
			</div>
			<div>
				<article className={styles.text}>4: {dummyText}</article>
			</div>
		</div>
	);
}

export default Rulesandregulation;
