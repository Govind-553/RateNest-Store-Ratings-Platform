import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; address: string; password: string }) => Promise<User>;
  logout: () => void;
  getDefaultRoute: (role?: Role) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getDefaultRoute = (role?: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'STORE_OWNER':
      return '/owner';
    case 'USER':
    default:
      return '/stores';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authService.login({ email, password });
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }): Promise<User> => {
    const res = await authService.register(data);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        getDefaultRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
