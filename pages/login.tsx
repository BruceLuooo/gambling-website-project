import styles from '../styles/Login.module.css';
import { useContext, useState } from 'react';
import {
	browserSessionPersistence,
	setPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase.config';
import { PersonalInfoContext } from '../context/personalInfoContext';
import { useLogin } from '../hooks/loginAndRegister/useLogin';
import Head from 'next/head';
import Link from 'next/link';

type InfoContext = {
	setPersonalInfo: Function;
};

const Login = () => {
	const router = useRouter();

	const { setPersonalInfo } = useContext(PersonalInfoContext) as InfoContext;
	const { updateLoginInfo, formIsCompleted, loginInfo } = useLogin();

	const [error, setError] = useState({ active: false, message: '' });

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formIsCompleted(loginInfo)) {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		setPersistence(auth, browserSessionPersistence).then(async () => {
			try {
				const { user } = await signInWithEmailAndPassword(
					auth,
					loginInfo.email,
					loginInfo.password,
				);

				if (user) {
					setError({ active: false, message: '' });

					const token = await user.getIdToken();
					sessionStorage.setItem('token', token);

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
				return setError({ active: true, message: 'Invalid Email/Password' });
			}
		});
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>NBetsA | Login</title>
				<link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
			</Head>
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
						onChange={updateLoginInfo}
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
						onChange={updateLoginInfo}
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
				Don&apos;t have an account? Register <Link href='/register'>Here</Link>
			</span>
		</div>
	);
};

export default Login;
