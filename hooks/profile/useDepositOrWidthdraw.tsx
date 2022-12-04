import { useState } from 'react';

interface Details {
	amount: number | null;
	name: string;
	cardNumber: string;
	cvv: string;
	expMonth: string;
	expYear: string;
}

export const useDepositOrWidthdraw = () => {
	const [bankDetails, setBankDetails] = useState<Details>({
		amount: null,
		name: '',
		cardNumber: '',
		cvv: '',
		expMonth: '',
		expYear: '',
	});

	const updateMoneyAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBankDetails(prev => ({
			...prev,
			amount: e.target.valueAsNumber,
		}));
	};
	const updateBankDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBankDetails(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const updateCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 3) {
			const maxLength = e.target.value.slice(0, 3);
			setBankDetails(prev => ({
				...prev,
				[e.target.id]: maxLength,
			}));
		} else {
			setBankDetails(prev => ({
				...prev,
				[e.target.id]: e.target.value,
			}));
		}
	};

	const updateExpDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 2) {
			const maxLength = e.target.value.slice(0, 2);
			setBankDetails(prev => ({
				...prev,
				[e.target.id]: maxLength,
			}));
		} else {
			setBankDetails(prev => ({
				...prev,
				[e.target.id]: e.target.value,
			}));
		}
	};

	const updateCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 19) {
			const maxLength = e.target.value.slice(0, 19);
			setBankDetails(prev => ({
				...prev,
				[e.target.id]: maxLength,
			}));
		} else {
			if (
				e.target.value.length === 4 ||
				e.target.value.length === 9 ||
				e.target.value.length === 14
			) {
				e.target.value = e.target.value += ' ';
			}

			setBankDetails(prev => ({
				...prev,
				[e.target.id]: e.target.value,
			}));
		}
	};

	const isFormCompletetd = (depositDetails: Details) => {
		return (
			depositDetails.cardNumber.length < 19 ||
			containsAnyLetters(depositDetails.cardNumber) ||
			depositDetails.cvv.length < 3 ||
			depositDetails.expMonth.length < 2 ||
			depositDetails.expYear.length < 2 ||
			depositDetails.amount === null ||
			0 ||
			depositDetails.amount < 0
		);
	};

	const containsAnyLetters = (detail: string) => {
		return /[a-zA-Z]/.test(detail);
	};

	return {
		bankDetails,
		setBankDetails,
		updateBankDetails,
		updateMoneyAmount,
		isFormCompletetd,
		updateCvv,
		updateExpDate,
		updateCardNumber,
	};
};
