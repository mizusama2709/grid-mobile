import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole } from '../types/models';

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  location: string;
}) {
  const { email, password, name, role, location } = params;
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: email.trim(),
      name,
      role,
      location,
      created_at: serverTimestamp(),
    });
  } catch (err) {
    try {
      await cred.user.delete();
    } catch (deleteErr) {
      throw new Error(
        `Account setup failed and could not be automatically rolled back. Contact support with this email: ${email.trim()}. ` +
          `(profile error: ${(err as any)?.message ?? err}; rollback error: ${(deleteErr as any)?.message ?? deleteErr})`,
      );
    }
    throw err;
  }

  return cred.user;
}
