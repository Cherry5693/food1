import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Raj Sharma',
    email: 'raj@vendor.com',
    password: 'password',
    role: 'vendor',
    location: 'Mumbai, Maharashtra',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    name: 'Priya Suppliers',
    email: 'priya@supplier.com',
    password: 'password',
    role: 'supplier',
    location: 'Delhi, NCR',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@vendor.com',
    password: 'password',
    role: 'vendor',
    location: 'Bangalore, Karnataka',
    phone: '+91 9876543212'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        location: foundUser.location,
        phone: foundUser.phone
      };
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      toast({
        title: "Registration Failed",
        description: "User with this email already exists",
        variant: "destructive",
      });
      return false;
    }

    // In a real app, this would make an API call
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      location: userData.location,
      phone: userData.phone
    };

    mockUsers.push({ ...newUser, password: userData.password });
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));

    toast({
      title: "Registration Successful",
      description: `Welcome, ${newUser.name}!`,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "See you soon!",
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