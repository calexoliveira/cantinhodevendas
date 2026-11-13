import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AuthUser = {
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'minhaloja.auth.user';
const USERS_STORAGE_KEY = 'minhaloja.auth.users';

const defaultUsers = [
  {
    name: 'Administrador',
    email: 'admin@minhaloja.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'Cliente Demo',
    email: 'cliente@minhaloja.com',
    password: 'cliente123',
    isAdmin: false,
  },
];

const getStoredUsers = () => {
  if (typeof window === 'undefined') {
    return defaultUsers;
  }

  const storedValue = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    return JSON.parse(storedValue) as Array<{
      name: string;
      email: string;
      password: string;
      isAdmin: boolean;
    }>;
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);

    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const matchedUser = users.find(
      (account) => account.email.toLowerCase() === normalizedEmail && account.password === password,
    );

    if (!matchedUser) {
      return false;
    }

    const authUser: AuthUser = {
      name: matchedUser.name,
      email: matchedUser.email,
      isAdmin: matchedUser.isAdmin,
    };

    setUser(authUser);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return true;
  };

  const register = (name: string, email: string, password: string) => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password.trim()) {
      return false;
    }

    const users = getStoredUsers();
    const alreadyExists = users.some((account) => account.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      return false;
    }

    const newUser = {
      name: trimmedName,
      email: normalizedEmail,
      password,
      isAdmin: false,
    };

    const nextUsers = [...users, newUser];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));

    const authUser: AuthUser = {
      name: trimmedName,
      email: normalizedEmail,
      isAdmin: false,
    };

    setUser(authUser);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, register, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
