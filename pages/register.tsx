import styles from '../styles/Register.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase.config';
import { setDoc, doc } from 'firebase/firestore';

interface login {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
	balance: number;
}

const Register = () => {
	const router = useRouter();
	const [registerInfo, setRegisterInfo] = useState<login>({
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		balance: 0,
	});
	const [error, setError] = useState({ active: false, message: '' });

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (registerInfo.confirmPassword !== registerInfo.password) {
			return setError({ active: true, message: 'passwords do not match' });
		}
		if (
			registerInfo.confirmPassword === '' ||
			registerInfo.lastname === '' ||
			registerInfo.email === '' ||
			registerInfo.name === '' ||
			registerInfo.password === ''
		) {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerInfo.email,
				registerInfo.password,
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
		<div className={styles.container}>
			<span className={styles.logoFont}>Create Your Account</span>
			<form className={styles.formContainer} onSubmit={onSubmit}>
				<div className={styles.fullName}>
					<div className={styles.input}>
						<label className={styles.label} htmlFor='name'>
							Name
						</label>
						<input
							className={styles.inputBox}
							id='name'
							type='text'
							onChange={onChange}
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
							onChange={onChange}
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
						onChange={onChange}
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
							onChange={onChange}
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
							onChange={onChange}
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
				Already have an account? Login <a href='/login'>Here</a>
			</span>
		</div>
	);
};

export default Register;
