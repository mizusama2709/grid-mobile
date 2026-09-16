import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @firebase/auth's exports map lists "types" before the "react-native"
// condition, so tsc always resolves the universal (non-RN) .d.ts here even
// though Metro correctly bundles the RN build at runtime — upstream types
// gap, not a resolution mistake on our end.
// @ts-expect-error - getReactNativePersistence exists at runtime (dist/rn) but isn't in the resolved .d.ts
import { getReactNativePersistence } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// firebase/auth's own export map has no react-native condition, but
// @firebase/auth's does (-> dist/rn), so persistence must be imported from
// there directly. Native gets AsyncStorage-backed persistence; web keeps
// plain getAuth (browser persistence is automatic).
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
