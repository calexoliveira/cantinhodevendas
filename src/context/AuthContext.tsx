import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AuthUser = {
  name: string;
  email: string;
  isAdmin: boolean;
  address?: string;
};

type StoredUser = AuthUser & {
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  updateAddress: (address: string) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'minhaloja.auth.user';
const USERS_STORAGE_KEY = 'minhaloja.auth.users';

const defaultUsers: StoredUser[] = [
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

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') {
    return defaultUsers;
  }

  const storedValue = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    return JSON.parse(storedValue) as StoredUser[];
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
      address: matchedUser.address,
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

  const updateAddress = useCallback((address: string) => {
    if (!user) {
      throw new Error('Cannot update the delivery address without an authenticated user.');
    }

    const updatedUser = { ...user, address: address.trim() };
    const storedUsers = getStoredUsers();
    const accountExists = storedUsers.some(
      (account) => account.email.toLowerCase() === user.email.toLowerCase(),
    );

    if (!accountExists) {
      throw new Error('Cannot update the delivery address because the user profile was not found.');
    }

    const nextUsers = storedUsers.map((account) =>
      account.email.toLowerCase() === user.email.toLowerCase()
        ? { ...account, address: updatedUser.address }
        : account,
    );

    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, register, updateAddress, logout }),
    [user, updateAddress],
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
