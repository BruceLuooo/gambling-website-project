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
	const formatCurrency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	if (transactionHistory.length === 0) {
		return (
			<div className={styles.container}>
				<span className={styles.transactionHistoryLabel}>
					Recent Transaction History
				</span>
				<span className={styles.noTransaction}>
					No Transaction Available To View
				</span>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<span className={styles.transactionHistoryLabel}>
				Recent Transaction History
			</span>
			{transactionHistory.map((transaction, index) => (
				<div className={styles.transactionContainer} key={index}>
					<div className={styles.dateLabel}>
						<span>{transaction.date}</span>
						<hr className={styles.line} />
					</div>
					<div className={styles.transaction}>
						<span>{transaction.type}</span>
						<span
							className={`${
								transaction.type === 'Deposit' ? styles.green : styles.red
							}`}
						>
							{transaction.type === 'Deposit' ? '+' : '-'}
							{formatCurrency.format(transaction.amount)}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
