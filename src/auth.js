import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("Firebase UID:", user.uid);
    console.log("Email:", user.email);
    console.log("Display Name:", user.displayName);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (err) {
    console.error("Google sign-in error:", err);
    throw err;
  }
}

export async function isAdmin(uid) {
  const ref = doc(db, "admins", uid);
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function signOutOfGoogle() {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (err) {
    console.error("Error signing out:", err);
  }
}
