import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const NOTES_COLLECTION = 'notes';

export async function addNote(userId, noteData) {
  const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
    userId,
    title: noteData.title || 'Untitled Note',
    text: noteData.text,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateNote(noteId, data) {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await updateDoc(noteRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteNote(noteId) {
  await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
}

export async function getUserNotes(userId) {
  const q = query(
    collection(db, NOTES_COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const notes = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() || new Date(),
    updatedAt: d.data().updatedAt?.toDate?.() || new Date()
  }));

  // Sort client-side to avoid needing a composite index in Firestore
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getNoteById(noteId) {
  const snap = await getDoc(doc(db, NOTES_COLLECTION, noteId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date()
  };
}

export function searchNotes(notes, queryStr) {
  const lower = queryStr.toLowerCase().trim();
  if (!lower) return notes;
  return notes.filter(
    (n) =>
      (n.title || '').toLowerCase().includes(lower) ||
      (n.text || '').toLowerCase().includes(lower)
  );
}
