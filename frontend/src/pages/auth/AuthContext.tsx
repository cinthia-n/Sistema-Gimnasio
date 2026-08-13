import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import {
  saveToken,
  saveUser,
  removeToken,
  removeUser,
  getUser,
} from './storage';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(
    getUser(),
  );

  function login(token: string, user: User) {
    saveToken(token);
    saveUser(user);
    setUser(user);
  }

  function logout() {
    removeToken();
    removeUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}