import { useState } from 'react';

interface login {
	email: string;
	password: string;
}

export const useLogin = () => {
	const [loginInfo, setLoginInfo] = useState<login>({
		email: '',
		password: '',
	});

	const { email, password } = loginInfo;

	const updateLoginInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const formIsCompleted = (loginInfo: login) => {
		return email === '' || password === '';
	};

	return { updateLoginInfo, formIsCompleted, loginInfo };
};
