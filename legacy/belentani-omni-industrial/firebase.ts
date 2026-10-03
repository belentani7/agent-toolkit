import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, increment, type Firestore } from 'firebase/firestore';
import type { Playlist } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'development-placeholder',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'belentani-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'belentani-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'belentani-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:development',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);

export const savePlaylist = async (uid: string, playlist: Playlist) => {
  const playlistId = playlist.id || `playlist_${Date.now()}`;
  await setDoc(doc(db, 'playlists', playlistId), {
    ...playlist,
    id: playlistId,
    userId: uid,
    createdAt: new Date().toISOString(),
  });
  return playlistId;
};

export const incrementGenerationCount = async (uid: string) => {
  await setDoc(doc(db, 'users', uid), { generationCount: increment(1) }, { merge: true });
};

export const updateUserDocument = async (uid: string, data: Record<string, unknown>) => {
  await updateDoc(doc(db, 'users', uid), data);
};
