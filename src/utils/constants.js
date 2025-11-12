export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  UNKNOWN: 'unknown',
};

export const ROLE_PREFIXES = {
  PATIENT: 'PAT',
  DOCTOR: 'DOC',
  HOSPITAL: 'HOSP',
  ADMIN: 'ADMIN',
};
