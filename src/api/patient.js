import api from './api';

export const getAllRecordsByPatientId = async (userId, patientId) => {
  return await api.post('/getAllRecordsByPatientId', { userId, patientId });
};

export const getRecordById = async (userId, patientId, recordId) => {
  return await api.post('/getRecordById', { userId, patientId, recordId });
};

export const updatePatientProfile = async (userId, name, dob, city) => {
  return await api.post('/updatePatientProfile', { userId, name, dob, city });
};

export const grantAccess = async (patientId, doctorIdToGrant, hospitalId) => {
  return await api.post('/grantAccess', { patientId, doctorIdToGrant, hospitalId });
};

export const revokeAccess = async (userId, patientId, doctorId) => {
  return await api.post('/revokeAccess', { userId, patientId, doctorId });
};

export const getAccessList = async (hospitalId, patientId) => {
  return await api.post('/getAccessList', { hospitalId, patientId });
};
