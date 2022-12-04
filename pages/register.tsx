import styles from '../styles/Register.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { useRegister } from '../hooks/loginAndRegister/useRegister';
import Head from 'next/head';
import Link from 'next/link';

const Register = () => {
	const router = useRouter();
	const {
		registerInfo,
		updateRegisterInfo,
		isFormCompleted,
		doesPasswordMatch,
		isPasswordLong,
	} = useRegister();
	const { email, password } = registerInfo;
	const [error, setError] = useState({ active: false, message: '' });

	const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (doesPasswordMatch()) {
			return setError({ active: true, message: 'passwords do not match' });
		}
		if (isPasswordLong()) {
			return setError({
				active: true,
				message: 'passwords must be 6+ characters',
			});
		}
		if (isFormCompleted(registerInfo)) {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		registerUser();
	};

	const registerUser = async () => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;
			const token = await user.getIdToken();
			sessionStorage.setItem('token', token);

			await setDoc(doc(db, 'users', user.uid), registerInfo);
			return router.push('/');
		} catch (error) {
			return setError({ active: true, message: 'Could Not Create Account' });
		}
	};

	return (
		<main className={styles.container}>
			<Head>
				<title>NBetsA | Register</title>
				<link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
			</Head>
			<span className={styles.logoFont}>Create Your Account</span>
			<form className={styles.formContainer} onSubmit={onSubmitForm}>
				<div className={styles.fullName}>
					<div className={styles.input}>
						<label className={styles.label} htmlFor='name'>
							Name
						</label>
						<input
							className={styles.inputBox}
							id='name'
							type='text'
							onChange={updateRegisterInfo}
						/>
					</div>
					<div className={styles.input}>
						<label className={styles.label} htmlFor='lastname'>
							Last name
						</label>
						<input
							className={styles.inputBox}
							id='lastname'
							type='text'
							onChange={updateRegisterInfo}
						/>
					</div>
				</div>

				<div className={styles.input}>
					<label className={styles.label} htmlFor='email'>
						Email
					</label>
					<input
						className={styles.inputBox}
						id='email'
						type='text'
						onChange={updateRegisterInfo}
					/>
				</div>
				<div className={styles.fullName}>
					<div className={styles.input}>
						<label className={styles.label} htmlFor='name'>
							Password
						</label>
						<input
							className={styles.inputBox}
							id='password'
							type='password'
							onChange={updateRegisterInfo}
						/>
					</div>
					<div className={styles.input}>
						<label className={styles.label} htmlFor='confirmPassword'>
							Confirm Password
						</label>
						<input
							className={styles.inputBox}
							id='confirmPassword'
							type='password'
							onChange={updateRegisterInfo}
						/>
					</div>
				</div>
				<div className={styles.invalidLogin}>
					{error.active && <div>{error.message}</div>}
				</div>
				<div>
					<button type='submit' className={styles.button}>
						Register
					</button>
				</div>
			</form>
			<span>
				Already have an account? Login <Link href='/login'>Here</Link>
			</span>
		</main>
	);
};

export default Register;
