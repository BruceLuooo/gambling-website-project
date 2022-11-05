import styles from '../styles/Login.module.css';
import { useContext, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase.config';
import { PersonalInfoContext } from '../context/personalInfoContext';

interface login {
	email: string;
	password: string;
}

type InfoContext = {
	setPersonalInfo: Function;
};

const Login = () => {
	const router = useRouter();

	const { setPersonalInfo } = useContext(PersonalInfoContext) as InfoContext;

	const [loginInfo, setLoginInfo] = useState<login>({
		email: '',
		password: '',
	});
	const [error, setError] = useState({ active: false, message: '' });

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loginInfo.email === '' || loginInfo.password === '') {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		try {
			const { user } = await signInWithEmailAndPassword(
				auth,
				loginInfo.email,
				loginInfo.password,
			);

			if (user) {
				setError({ active: false, message: '' });

				const token = await user.getIdToken();
				localStorage.setItem('token', token);

				const docRef = doc(db, 'users', `${auth.currentUser!.uid}`);
				const docSnap = await getDoc(docRef);
				setPersonalInfo({
					name: docSnap.data()!.name,
					lastname: docSnap.data()!.lastname,
					email: docSnap.data()!.email,
					balance: docSnap.data()!.balance,
				});

				router.push('/');
			}
		} catch (error) {
			console.log(error);
			return setError({ active: true, message: 'Invalid Email/Password' });
		}
	};

	return (
		<div className={styles.container}>
			<span className={styles.logoFont}>Sign Into Your Account</span>
			<form className={styles.formContainer} onSubmit={onSubmit}>
				<div className={styles.input}>
					<label className={styles.label} htmlFor='email'>
						Email
					</label>
					<input
						className={styles.inputBox}
						id='email'
						type='text'
						onChange={onChange}
					/>
				</div>
				<div className={styles.input}>
					<label className={styles.label} htmlFor='password'>
						Password
					</label>
					<input
						className={styles.inputBox}
						id='password'
						type='password'
						onChange={onChange}
					/>
				</div>
				<div className={styles.invalidLogin}>
					{error.active && <div>{error.message}</div>}
				</div>
				<div>
					<button type='submit' className={styles.button}>
						Login
					</button>
				</div>
			</form>
			<span>
				Don't have an account? Register <a href='/register'>Here</a>
			</span>
		</div>
	);
};

export default Login;
