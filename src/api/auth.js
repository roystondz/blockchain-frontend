import api from './api';

export const login = async (userId) => {
  return await api.post('/login', { userId });
};

export const logout = () => {
  localStorage.removeItem('userId');
};
