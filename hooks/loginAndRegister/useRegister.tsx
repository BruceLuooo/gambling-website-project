import { useState } from 'react';

interface login {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
	balance: number;
}

export const useRegister = () => {
	const [registerInfo, setRegisterInfo] = useState<login>({
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		balance: 0,
	});

	const { name, lastname, email, password, confirmPassword } = registerInfo;

	const updateRegisterInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const doesPasswordMatch = () => {
		return confirmPassword !== password;
	};
	const isPasswordLong = () => {
		return password.length <= 6;
	};
	const isFormCompleted = (registerInfo: login) => {
		return (
			confirmPassword === '' ||
			lastname === '' ||
			email === '' ||
			name === '' ||
			password === ''
		);
	};

	return {
		registerInfo,
		updateRegisterInfo,
		isFormCompleted,
		doesPasswordMatch,
		isPasswordLong,
	};
};
