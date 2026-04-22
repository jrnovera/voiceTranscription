import { doc, getDoc, setDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

const USERS_COLLECTION = 'users';

export async function createUserDoc(uid, data) {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'user',
    createdAt: new Date().toISOString()
  });
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function setUserRole(uid, role) {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { role });
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
