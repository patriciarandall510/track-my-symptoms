"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
  linkWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try {
          const cred = await signInAnonymously(auth);
          setUser(cred.user);
        } catch (err) {
          console.error("Failed to sign in anonymously", err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const linkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(auth.currentUser!, provider);
    } catch (err) {
      console.error("Failed to link Google account", err);
      setError(err as Error);
    }
  };

  return { user, loading, error, linkGoogle };
}
