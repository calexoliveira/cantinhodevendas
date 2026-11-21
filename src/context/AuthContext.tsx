import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest, errorMessage } from '../api';
import type { BrazilianDocumentType } from '../utils/brazilianDocument';
import { AuthContext } from './useAuth';

export type AccountType = 'customer' | 'merchant';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  accountType: AccountType;
  documentNumber?: string | null;
  documentType?: BrazilianDocumentType | null;
  phone?: string | null;
  storeId?: string | null;
  storeName?: string | null;
  businessAddress?: string | null;
  address?: string | null;
};

export type MerchantStore = {
  id: string;
  name: string;
  address: string;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
  documentNumber: string;
  phone: string;
  storeName?: string;
  businessAddress?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  merchants: MerchantStore[];
  login: (email: string, password: string) => Promise<AccountType>;
  register: (registration: RegistrationData) => Promise<void>;
  updateAddress: (address: string) => Promise<void>;
  logout: () => Promise<void>;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [merchants, setMerchants] = useState<MerchantStore[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    Promise.all([
      apiRequest<{ user: AuthUser | null }>('/auth/me'),
      apiRequest<MerchantStore[]>('/stores'),
    ]).then(([session, stores]) => {
      if (active) {
        setUser(session.user);
        setMerchants(stores);
        setReady(true);
      }
    }).catch((reason: unknown) => {
      if (active) setError(errorMessage(reason));
    });
    return () => { active = false; };
  }, [attempt]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(result.user);
    return result.user.accountType;
  }, []);

  const register = useCallback(async (registration: RegistrationData) => {
    const result = await apiRequest<{ user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registration),
    });
    setUser(result.user);
    const { storeId, storeName, businessAddress } = result.user;
    if (storeId && storeName) {
      setMerchants((current) => [...current, { id: storeId, name: storeName, address: businessAddress ?? '' }]);
    }
  }, []);

  const updateAddress = useCallback(async (address: string) => {
    const result = await apiRequest<{ user: AuthUser }>('/auth/address', {
      method: 'PATCH',
      body: JSON.stringify({ address }),
    });
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (reason) {
      window.alert(errorMessage(reason));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, merchants, login, register, updateAddress, logout }),
    [user, merchants, login, register, updateAddress, logout],
  );

  if (error) {
    return <main className="page-shell"><p role="alert">{error}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Tentar novamente</button></main>;
  }
  if (!ready) return <main className="page-shell"><p>Conectando ao servidor...</p></main>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
