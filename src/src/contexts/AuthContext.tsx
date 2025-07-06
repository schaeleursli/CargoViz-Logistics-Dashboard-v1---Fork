import React, { useEffect, useState, createContext, useContext } from 'react';
import { cargoVizAPI } from '../services/cargoVizAPI';
import { User } from '../services/cargoVizAPI';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = () => {
    const token = localStorage.getItem('cargoviz_token');
    const userData = localStorage.getItem('cargoviz_user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (e) {
        // If JSON parsing fails, clear the invalid data
        localStorage.removeItem('cargoviz_token');
        localStorage.removeItem('cargoviz_user');
      }
    }
    setLoading(false);
  };
  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const res = await cargoVizAPI.login(email, password);
      // Guard against empty / malformed payloads
      if (!res || !res.token || !res.user) {
        throw new Error('Invalid credentials or empty response from server');
      }
      // Persist session
      localStorage.setItem('cargoviz_token', res.token);
      localStorage.setItem('cargoviz_user', JSON.stringify(res.user));
      setUser(res.user);
      setIsAuthenticated(true);
      return {
        success: true,
        user: res.user
      };
    } catch (error) {
      // Axios errors come through the ApiClient interceptor as ApiError
      const message = error instanceof Error ? error.message : 'Login failed – unknown error';
      console.error('[Auth] login error:', error);
      return {
        success: false,
        error: message
      };
    }
  };
  const logout = () => {
    localStorage.removeItem('cargoviz_token');
    localStorage.removeItem('cargoviz_user');
    setUser(null);
    setIsAuthenticated(false);
  };
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};