import React, { useEffect, useState, createContext, useContext } from 'react';
import { cargoVizAPI } from '../services/cargoVizAPI';
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
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
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  };
  const login = async (email: string, password: string) => {
    try {
      const {
        token,
        user: userData
      } = await cargoVizAPI.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
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