import { createContext, ReactNode, useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
interface Info {
	name: string;
	lastname: string;
	email: string;
	balance: number;
}

type PersonalInfoContext = {
	personalInfo: Info;
	removeFromBalance: Function;
	addToBalance: Function;
	setPersonalInfo: Function;
};

interface Props {
	children: ReactNode;
}

export const PersonalInfoContext = createContext<PersonalInfoContext | null>(
	null,
);

export const PersonalInfoProvider = ({ children }: Props) => {
	const [personalInfo, setPersonalInfo] = useState<Info>({
		name: '',
		lastname: '',
		email: '',
		balance: 0,
	});

	useEffect(() => {
		auth.onAuthStateChanged(async user => {
			if (user) {
				const docRef = doc(db, 'users', `${auth.currentUser!.uid}`);
				const docSnap = await getDoc(docRef);
				setPersonalInfo({
					name: docSnap.data()!.name,
					lastname: docSnap.data()!.lastname,
					email: docSnap.data()!.email,
					balance: docSnap.data()!.balance,
				});
			}
		});
	}, []);

	const removeFromBalance = async (amount: number) => {
		const newBalance = personalInfo.balance - amount;

		await updateDoc(doc(db, 'users', `${auth.currentUser!.uid}`), {
			balance: newBalance,
		});

		setPersonalInfo(prev => ({
			...prev,
			balance: newBalance,
		}));
	};

	const addToBalance = async (amount: number) => {
		const newBalance = personalInfo.balance - amount;

		await updateDoc(doc(db, 'users', `${auth.currentUser!.uid}`), {
			balance: newBalance,
		});

		setPersonalInfo(prev => ({
			...prev,
			balance: newBalance,
		}));
	};

	return (
		<PersonalInfoContext.Provider
			value={{ personalInfo, removeFromBalance, setPersonalInfo, addToBalance }}
		>
			{children}
		</PersonalInfoContext.Provider>
	);
};
