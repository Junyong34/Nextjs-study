import { InAuthUser } from '@/models/in_auth_user';
import { createContext, ReactNode, useContext } from 'react';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

interface InAuthUserContext {
  authUser: InAuthUser | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

export const AuthUserProvider = ({ children }: { children: ReactNode }) => {
  const { authUser, loading, signInWithGoogle, signOut } = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={{ authUser, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthUserContext.Provider>
  );
};
export const useAuth = () => useContext(AuthUserContext);
