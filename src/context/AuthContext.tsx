import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Farm {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  soilType?: string;
  area?: number;
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

const STORAGE_KEYS = {
  USERS: 'agrovision_users',
  CURRENT: 'agrovision_current_user',
};

function getStoredUsers(): Record<string, User> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    const cleaned: Record<string, User> = {};
    Object.entries(raw).forEach(([email, value]) => {
      const u = value as Partial<User> & { farmName?: string; location?: string };
      const isLegacyDemo = u.name === 'Rajesh Kumar' || email === 'farmer@agrovision.ai' || email === 'farmer@agrisense.ai';
      const isValid = Boolean(u.email && u.name && Array.isArray(u.farms));
      if (!isLegacyDemo && isValid) cleaned[email] = u as User;
    });
    if (Object.keys(cleaned).length !== Object.keys(raw).length) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch { return {}; }
}

function getStoredCurrentUser(): User | null {
  // Remove old demo keys from earlier prototypes. They contained the hardcoded Rajesh user.
  try {
    localStorage.removeItem('agrovision_user');
    localStorage.removeItem('agrisense_user');
    localStorage.removeItem('user_farm');
  } catch {}

  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT);
    if (!data) return null;
    const parsed = JSON.parse(data) as Partial<User> & { farmName?: string; location?: string };
    const isLegacyDemo = parsed.name === 'Rajesh Kumar' || parsed.email === 'farmer@agrovision.ai' || parsed.email === 'farmer@agrisense.ai';
    const isValid = Boolean(parsed.email && parsed.name && Array.isArray(parsed.farms));
    if (isLegacyDemo || !isValid) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT);
      return null;
    }
    return parsed as User;
  } catch { return null; }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Aggressive cleanup of old keys
  try {
    const KEYS_TO_CLEAR = [
      'agrisense_user',        // Original name
      'app_user',              // Another possible old key
      'farm_user',             // Another possible old key
    ];
    KEYS_TO_CLEAR.forEach(k => {
      const v = localStorage.getItem(k);
      if (v) {
        try {
          const parsed = JSON.parse(v);
          if (parsed?.email) {
            // Migrate to the users registry if not already there
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
            if (!users[parsed.email]) {
              users[parsed.email] = {
                id: parsed.id || 'user_migrated_' + Date.now(),
                name: parsed.name || parsed.farmName || 'Farmer',
                email: parsed.email,
                avatar: parsed.avatar || 'FA',
                farms: Array.isArray(parsed.farms) ? parsed.farms : [],
                activeFarmId: parsed.activeFarmId || null,
              };
              localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            }
          }
        } catch {}
        localStorage.removeItem(k);
      }
    });
  } catch {}

  // If a previous build migrated the demo user, remove it now.
  try {
    const current = localStorage.getItem(STORAGE_KEYS.CURRENT);
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed?.name === 'Rajesh Kumar' || parsed?.email === 'farmer@agrovision.ai' || parsed?.email === 'farmer@agrisense.ai') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT);
      }
    }
    const users = getStoredUsers();
    delete users['farmer@agrovision.ai'];
    delete users['farmer@agrisense.ai'];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}

  const [user, setUser] = useState<User | null>(getStoredCurrentUser);
  const [isLoading, setIsLoading] = useState(false);

  const persistUser = useCallback((u: User) => {
    const users = getStoredUsers();
    users[u.email] = u;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(u));
    setUser(u);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const users = getStoredUsers();
    const existingUser = users[email];

    if (existingUser) {
      // Known user — welcome back
      persistUser(existingUser);
      setIsLoading(false);
      return true;
    }

    // User doesn't exist — reject
    setIsLoading(false);
    return false;
  }, [persistUser]);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const users = getStoredUsers();
    if (users[data.email]) {
      setIsLoading(false);
      return false; // Email already taken
    }

    const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: data.name,
      email: data.email,
      avatar: initials || 'FA',
      farms: [],
      activeFarmId: null,
    };

    persistUser(newUser);
    setIsLoading(false);
    return true;
  }, [persistUser]);

  const addFarm = useCallback((farm: Farm) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        farms: [...prev.farms, farm],
        activeFarmId: prev.activeFarmId || farm.id,
      };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const updateFarm = useCallback((farmId: string, updates: Partial<Farm>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        farms: prev.farms.map(f => f.id === farmId ? { ...f, ...updates } : f),
      };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const removeFarm = useCallback((farmId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const remaining = prev.farms.filter(f => f.id !== farmId);
      const newActiveId = prev.activeFarmId === farmId
        ? (remaining.length > 0 ? remaining[0].id : null)
        : prev.activeFarmId;
      const updated: User = { ...prev, farms: remaining, activeFarmId: newActiveId };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const setActiveFarm = useCallback((farmId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated: User = { ...prev, activeFarmId: farmId };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, login, signup,
      addFarm, updateFarm, removeFarm, setActiveFarm,
      logout, isLoading,
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
