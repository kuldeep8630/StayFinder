import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.log('No token found, setting user to null');
        setUser(null);
        return;
      }

      try {
        console.log('Fetching user profile with token:', token);
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User profile fetched successfully:', response.data);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err.response?.data?.message || err.message);
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      console.log('Login successful, setting token:', token);
      localStorage.setItem('token', token);
      setToken(token);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.message || err.message);
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out, clearing token and user');
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};