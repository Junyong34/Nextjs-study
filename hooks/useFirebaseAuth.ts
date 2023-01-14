import { useEffect, useState } from 'react';
import { InAuthUser } from '@/models/in_auth_user';
import FirebaseClient from '@/models/firebase_client';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      const { user } = result;
      if (user) {
        setAuthUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        const resp = await fetch('/api/members.add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        });
        console.info({ status: resp.status, body: await resp.json() });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await FirebaseClient.getInstance().Auth.signOut();
    setAuthUser(null);
    setLoading(true);
  };

  return { authUser, loading, signInWithGoogle, signOut };
}
