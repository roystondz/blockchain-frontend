import api from './api';

export const fetchLedger = async (userId) => {
  return await api.post('/fetchLedger', { userId });
};

export const getSystemStats = async () => {
  return await api.get('/getSystemStats');
};

