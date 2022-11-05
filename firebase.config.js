// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyA21lng6obX9Utudgp2nSgwjXyRNzX9CPc',
	authDomain: 'sports-betting-7aa2c.firebaseapp.com',
	projectId: 'sports-betting-7aa2c',
	storageBucket: 'sports-betting-7aa2c.appspot.com',
	messagingSenderId: '755312347289',
	appId: '1:755312347289:web:c3da172bc3df1aa2d55008',
	measurementId: 'G-FXDXE4TX84',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
