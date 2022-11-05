import React from 'react';
import styles from '../../../styles/profilePage/TransactionHistory.module.css';

interface Transaction {
	date: string;
	amount: number;
	type: string;
}

type Props = {
	transactionHistory: Transaction[];
};

export default function TransactionHistory({ transactionHistory }: Props) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return (
		<div className={styles.container}>
			<span className={styles.transactionHistoryLabel}>
				Transaction History
			</span>
			{transactionHistory.map(transaction => (
				<div className={styles.transactionContainer}>
					<div className={styles.dateLabel}>
						<span>{transaction.date}</span>
						<hr className={styles.line} />
					</div>
					<div className={styles.transaction}>
						<span>{transaction.type}</span>
						<span>{formatter.format(transaction.amount)}</span>
					</div>
				</div>
			))}
		</div>
	);
}
