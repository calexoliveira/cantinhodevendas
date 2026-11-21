import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { demoStore } from '../data/stores';
import {
  getDocumentDigits,
  identifyBrazilianDocument,
  isValidBrazilianDocument,
  type BrazilianDocumentType,
} from '../utils/brazilianDocument';

export type AccountType = 'customer' | 'merchant';

export type AuthUser = {
  name: string;
  email: string;
  isAdmin: boolean;
  accountType: AccountType;
  documentNumber?: string;
  documentType?: BrazilianDocumentType;
  phone?: string;
  storeName?: string;
  businessAddress?: string;
  address?: string;
};

export type MerchantStore = {
  id: string;
  name: string;
  address: string;
};

type LegacyDocumentFields = {
  cpf?: string;
  cnpj?: string;
};

type StoredUser = AuthUser & {
  password: string;
} & LegacyDocumentFields;

type RegistrationData = {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
  documentNumber: string;
  phone: string;
  storeName?: string;
  businessAddress?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  merchants: MerchantStore[];
  login: (email: string, password: string) => AccountType | null;
  register: (registration: RegistrationData) => boolean;
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
    accountType: 'customer',
  },
  {
    name: 'Cliente Demo',
    email: 'cliente@minhaloja.com',
    password: 'cliente123',
    isAdmin: false,
    accountType: 'customer',
  },
];

const normalizeAccountType = (accountType: unknown): AccountType =>
  accountType === 'merchant' ? 'merchant' : 'customer';

const getStoredDocument = (
  account: Pick<AuthUser, 'documentNumber' | 'documentType'> & LegacyDocumentFields,
): Pick<AuthUser, 'documentNumber' | 'documentType'> => {
  const documentNumber = account.documentNumber ?? account.cnpj ?? account.cpf;

  if (!documentNumber) {
    return {};
  }

  const normalizedDocument = getDocumentDigits(documentNumber);
  const documentType =
    identifyBrazilianDocument(normalizedDocument) ?? account.documentType;

  return {
    documentNumber: normalizedDocument,
    ...(documentType ? { documentType } : {}),
  };
};

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
    const storedUsers = JSON.parse(storedValue) as StoredUser[];
    return storedUsers.map((account) => ({
      ...account,
      accountType: normalizeAccountType(account.accountType),
      ...getStoredDocument(account),
    }));
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

const getMerchantDirectory = (): MerchantStore[] => [
  ...getStoredUsers().flatMap((account) => {
    if (account.accountType !== 'merchant' || !account.storeName?.trim()) {
      return [];
    }

    return [{
      id: account.email,
      name: account.storeName,
      address: account.businessAddress ?? '',
    }];
  }),
  demoStore,
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const storedUser = JSON.parse(stored) as AuthUser & LegacyDocumentFields;
    return {
      ...storedUser,
      accountType: normalizeAccountType(storedUser.accountType),
      ...getStoredDocument(storedUser),
    };
  });
  const [merchants, setMerchants] = useState<MerchantStore[]>(getMerchantDirectory);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const matchedUser = users.find(
      (account) => account.email.toLowerCase() === normalizedEmail && account.password === password,
    );

    if (!matchedUser) {
      return null;
    }

    const authUser: AuthUser = {
      name: matchedUser.name,
      email: matchedUser.email,
      isAdmin: matchedUser.isAdmin,
      accountType: normalizeAccountType(matchedUser.accountType),
      ...getStoredDocument(matchedUser),
      phone: matchedUser.phone,
      storeName: matchedUser.storeName,
      businessAddress: matchedUser.businessAddress,
      address: matchedUser.address,
    };

    setUser(authUser);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser.accountType;
  };

  const register = (registration: RegistrationData) => {
    const trimmedName = registration.name.trim();
    const normalizedEmail = registration.email.trim().toLowerCase();
    const documentNumber = getDocumentDigits(registration.documentNumber);
    const documentType = identifyBrazilianDocument(documentNumber);
    const trimmedPhone = registration.phone.trim();
    const trimmedStoreName = registration.storeName?.trim();
    const trimmedBusinessAddress = registration.businessAddress?.trim();

    if (
      !trimmedName ||
      !normalizedEmail ||
      !registration.password.trim() ||
      !trimmedPhone ||
      !documentType ||
      !isValidBrazilianDocument(documentNumber)
    ) {
      return false;
    }

    const merchantDetails =
      registration.accountType === 'merchant' &&
      trimmedStoreName &&
      trimmedBusinessAddress
        ? {
            storeName: trimmedStoreName,
            businessAddress: trimmedBusinessAddress,
          }
        : undefined;

    if (registration.accountType === 'merchant' && !merchantDetails) {
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
      password: registration.password,
      isAdmin: false,
      accountType: registration.accountType,
      documentNumber,
      documentType,
      phone: trimmedPhone,
      ...merchantDetails,
    };

    const nextUsers = [...users, newUser];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));

    if (merchantDetails) {
      setMerchants((current) => [
        ...current,
        {
          id: normalizedEmail,
          name: merchantDetails.storeName,
          address: merchantDetails.businessAddress,
        },
      ]);
    }

    const authUser: AuthUser = {
      name: trimmedName,
      email: normalizedEmail,
      isAdmin: false,
      accountType: registration.accountType,
      documentNumber,
      documentType,
      phone: trimmedPhone,
      ...merchantDetails,
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
    () => ({ user, merchants, login, register, updateAddress, logout }),
    [user, merchants, updateAddress],
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
