import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cargoVizAPI, User } from '../services/cargoVizAPI';

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

/* Keys used throughout the app */
const TOKEN_KEY = 'cargoviz_token';
const USER_KEY = 'cargoviz_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /** Bootstraps auth state on first render */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        /* Corrupt JSON → clear the bad data */
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  /** Logs the user in and persists token/user in localStorage */
  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const res = await cargoVizAPI.login(email, password);

      if (!res?.token || !res?.user) {
        throw new Error('Invalid credentials or empty response from server');
      }

      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setUser(res.user);
      setIsAuthenticated(true);

      return { success: true, user: res.user };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Login failed – unknown error';
      console.error('[Auth] login error:', err);
      return { success: false, error: msg };
    }
  };

  /** Clears session from memory and localStorage */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
