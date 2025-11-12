import api from './api';

export const registerHospital = async (adminId, hospitalId, name, city) => {
  return await api.post('/registerHospital', {
    adminId,
    hospitalId,
    name,
    city,
  });
};

export const registerDoctor = async (data) => {
  return await api.post('/registerDoctor', data);
};

export const registerPatient = async (data) => {
  return await api.post('/registerPatient', data);
};

