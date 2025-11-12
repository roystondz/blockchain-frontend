import api from './api';

export const getPatientsForDoctor = async (doctorId) => {
  return await api.post('/getPatientsForDoctor', { doctorId });
};

export const addRecord = async (doctorId, patientId, diagnosis, prescription, reportFile) => {
  const formData = new FormData();
  formData.append('doctorId', doctorId);
  formData.append('patientId', patientId);
  formData.append('diagnosis', diagnosis);
  formData.append('prescription', prescription);
  formData.append('report', reportFile);
  
  return await api.post('/addRecord', formData, true);
};
