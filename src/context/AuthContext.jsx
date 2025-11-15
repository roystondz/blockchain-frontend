import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api'; // if you use this for backend login

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUser({ userId, role: getUserRole(userId) });
    }
    setLoading(false);
  }, []);
console.log("0")
  const getUserRole = (id) => {
    if (id.startsWith('PAT')) return 'patient';
    if (id.startsWith('DOC')) return 'doctor';
    if (id.startsWith('HOSP') || id.startsWith('hospitalADMIN')) return 'admin';
    return 'unknown';
  };

  const login = async (userId) => {
    await api.post('/login', { userId });
    localStorage.setItem('userId', userId);
    const role = getUserRole(userId);
    setUser({ userId, role });
    return role;
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
