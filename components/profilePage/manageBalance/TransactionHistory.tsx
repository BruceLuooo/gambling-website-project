import React from 'react';
import styles from '../../../styles/profilePage/TransactionHistory.module.css';
import creditCard from '../../../public/creditCard.svg';
import Image from 'next/image';

interface Transaction {
	date: string;
	amount: number;
	type: string;
	cardNumber: string;
}

type Props = {
	transactionHistory: Transaction[];
};

export default function TransactionHistory({ transactionHistory }: Props) {
	const formatCurrency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const headers = ['Date', 'Transaction', 'Status', 'Card', 'Amount'];

	if (transactionHistory.length === 0) {
		return (
			<div className={styles.container}>
				<span className={styles.transactionHistoryLabel}>
					Transaction History
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
				Transaction History
			</span>
			<div className={`${styles.transactionHistory}`}>
				{headers.map((transactionHeader, index) => (
					<div
						key={index}
						className={`${styles.gridContainer}  ${styles.transactionHeader} ${
							transactionHeader === 'Date' && styles.transactionDate
						} `}
					>
						{transactionHeader}
					</div>
				))}
			</div>
			{transactionHistory.map((transaction, index) => (
				<div key={index} className={styles.transactionHistory}>
					<span
						className={`${styles.gridContainer} ${styles.transactionDate} `}
					>
						<div className={styles.test}>{transaction.date}</div>
					</span>
					<span className={styles.gridContainer}>{transaction.type}</span>
					<div className={`${styles.gridContainer} `}>
						<span className={`${styles.completed}`}>Completed</span>
					</div>
					<div className={`${styles.gridContainer} ${styles.cardInfo} `}>
						<Image src={creditCard} alt='credit card' width={16} />
						<span>{transaction.cardNumber}</span>
					</div>
					<span
						className={`${
							transaction.type === 'Deposit' ? styles.green : styles.red
						} ${styles.gridContainer}`}
					>
						{transaction.type === 'Deposit' ? '+' : '-'}
						{formatCurrency.format(transaction.amount)}
					</span>
				</div>
			))}
		</div>
	);
}
