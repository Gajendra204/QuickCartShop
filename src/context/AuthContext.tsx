// /src/context/AuthContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {shopkeeperService} from '../services/api';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!token;
  useEffect(() => {
    // Check for existing token on app load
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Loaded token from storage:', storedToken); // Debug log
        if (storedToken) {
          console.log('Loaded token from storage: 22222', storedToken); // Debug log
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load token', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(
        'inside the auth context login method >>>>>> ',
        email,
        password,
      );
      const response = await shopkeeperService.login({email, password});
      const newToken = response.data.token;
      console.log('inside the auth context login method >>>>>> ', newToken);
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      console.log('token added to sotrage here successfully');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await shopkeeperService.register({name, email, password});
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{token, isLoading, isAuthenticated, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
