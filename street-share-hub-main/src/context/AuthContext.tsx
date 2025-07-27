import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { toast } from '@/hooks/use-toast';
import * as authService from '../services/authService';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token and user on app start
    const token = authService.getToken();
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login({ email, password });
      const { token, user: userData } = res.data as { token: string; user: User };
      authService.setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`,
      });
      return true;
    } catch (err: any) {
      toast({
        title: 'Login Failed',
        description: err.response?.data?.msg || 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      await authService.register(userData);
      // Optionally, auto-login after registration
      await login(userData.email, userData.password);
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${userData.name}!`,
      });
      return true;
    } catch (err: any) {
      toast({
        title: 'Registration Failed',
        description: err.response?.data?.msg || 'Registration error',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.removeToken();
    localStorage.removeItem('user');
    toast({
      title: 'Logged Out',
      description: 'See you soon!',
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};