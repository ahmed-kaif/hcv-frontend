'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = Cookies.get('access_token');
      if (token) setUser({ token });
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      Cookies.set('access_token', access_token, { expires: 7 });
      setUser({ token: access_token });
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Use axios instance to register
      await api.post('/auth/register', { name, email, password });
      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const response = await api.get('/auth/google-login'); // use axios for consistency
      const data = response.data;

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No Google authorization URL received');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
