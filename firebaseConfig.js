// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCmK8s5XzVBh4_HmlcjM7cSQ0AW7PR4bgI",
    authDomain: "language-translator-753ff.firebaseapp.com",
    projectId: "language-translator-753ff",
    storageBucket: "language-translator-753ff.firebasestorage.app",
    messagingSenderId: "826326634308",
    appId: "1:826326634308:web:a70114a62d02ea003b9111"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app); // Ensure the variable is named 'firestore'
