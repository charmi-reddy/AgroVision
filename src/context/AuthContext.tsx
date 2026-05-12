import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiCurrentUser, apiForgotPassword, apiLogin, apiSaveUser, apiSignup } from '../services/api';

export interface Farm {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  soilType?: string;
  area?: number;
  crop?: string;
  irrigationAmount?: string;
  irrigationSource?: string;
  fertilizer?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  farms: Farm[];
  activeFarmId: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  addFarm: (farm: Farm) => void;
  updateFarm: (farmId: string, updates: Partial<Farm>) => void;
  removeFarm: (farmId: string) => void;
  setActiveFarm: (farmId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

const SESSION_KEY = 'agrovision_auth_session';

interface StoredSession {
  accessToken?: string;
  user?: User;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readSession(): StoredSession {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeSession(session: StoredSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearLegacyAuthStorage() {
  [
    'agrovision_users',
    'agrovision_current_user',
    'agrovision_user',
    'agrisense_user',
    'user_farm',
    'app_user',
    'farm_user',
  ].forEach(key => localStorage.removeItem(key));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => readSession().accessToken || null);
  const [user, setUser] = useState<User | null>(() => readSession().user || null);
  const [isLoading, setIsLoading] = useState(Boolean(readSession().accessToken));

  const storeAuth = useCallback((nextUser: User, nextToken?: string | null) => {
    const normalizedUser = { ...nextUser, email: normalizeEmail(nextUser.email) };
    setUser(normalizedUser);
    if (nextToken) setAccessToken(nextToken);
    writeSession({ user: normalizedUser, accessToken: nextToken || accessToken || undefined });
    return normalizedUser;
  }, [accessToken]);

  const syncUser = useCallback((nextUser: User) => {
    const saved = storeAuth(nextUser);
    apiSaveUser(saved, accessToken).catch(error => {
      console.error('Failed to sync user:', error);
    });
    return saved;
  }, [accessToken, storeAuth]);

  useEffect(() => {
    clearLegacyAuthStorage();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    let alive = true;
    apiCurrentUser(accessToken)
      .then(serverUser => {
        if (alive) storeAuth(serverUser as User, accessToken);
      })
      .catch(() => {
        if (!alive) return;
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem(SESSION_KEY);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [accessToken, storeAuth]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await apiLogin(normalizeEmail(email), password);
      storeAuth(result.user as User, result.accessToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storeAuth]);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await apiSignup({ ...data, email: normalizeEmail(data.email) });
      storeAuth(result.user as User, result.accessToken);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storeAuth]);

  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiForgotPassword(normalizeEmail(email));
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFarm = useCallback((farm: Farm) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        farms: [...prev.farms, farm],
        activeFarmId: prev.activeFarmId || farm.id,
      };
      return syncUser(updated);
    });
  }, [syncUser]);

  const updateFarm = useCallback((farmId: string, updates: Partial<Farm>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        farms: prev.farms.map(farm => farm.id === farmId ? { ...farm, ...updates } : farm),
      };
      return syncUser(updated);
    });
  }, [syncUser]);

  const removeFarm = useCallback((farmId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const farms = prev.farms.filter(farm => farm.id !== farmId);
      const activeFarmId = prev.activeFarmId === farmId ? farms[0]?.id || null : prev.activeFarmId;
      return syncUser({ ...prev, farms, activeFarmId });
    });
  }, [syncUser]);

  const setActiveFarm = useCallback((farmId: string) => {
    setUser(prev => prev ? syncUser({ ...prev, activeFarmId: farmId }) : prev);
  }, [syncUser]);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      forgotPassword,
      addFarm,
      updateFarm,
      removeFarm,
      setActiveFarm,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}
