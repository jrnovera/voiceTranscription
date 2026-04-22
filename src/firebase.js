import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_K2u8vUUZ4YbY1oe8UpGUsPCIXXP3e20",
  authDomain: "voicetranscription-cf8f8.firebaseapp.com",
  projectId: "voicetranscription-cf8f8",
  storageBucket: "voicetranscription-cf8f8.firebasestorage.app",
  messagingSenderId: "974225859644",
  appId: "1:974225859644:web:c56155eb8cab5819848f39"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
