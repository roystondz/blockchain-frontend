// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000',
//   headers: { 'Content-Type': 'application/json' }
// });

// export default api;
// src/utils/api.js
// ✅ Mock Axios-like API for testing without backend

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockData = {
  hospitals: [
    { hospitalId: "HOSP-01", name: "City General", city: "Bangalore" },
    { hospitalId: "HOSP-02", name: "Sunrise Health", city: "Mumbai" },
  ],
  doctors: [
    { doctorId: "DOC-01", name: "Dr. Raj Kumar", department: "Cardiology", city: "Bangalore" },
    { doctorId: "DOC-02", name: "Dr. Anjali Mehta", department: "Neurology", city: "Mumbai" },
  ],
  patients: [
    { patientId: "PAT-01", name: "Rohan Sharma", dob: "1998-03-22", city: "Bangalore" },
    { patientId: "PAT-02", name: "Priya Patel", dob: "2000-07-12", city: "Mumbai" },
  ],
  records: [
    {
      recordId: "REC-01",
      patientId: "PAT-01",
      diagnosis: "Common Cold",
      prescription: "Paracetamol 500mg",
      doctorId: "DOC-01",
      ipfsHash: "QmFakeHash123",
      timestamp: new Date().toISOString(),
    },
  ],
};

const api = {
  post: async (url, body) => {
    console.log(`🔵 Mock POST: ${url}`, body);
    await delay(500);

    switch (url) {
      case "/login":
        return {
          data: { success: true, data: { userId: body.userId } },
        };

      case "/registerHospital":
      case "/registerDoctor":
      case "/registerPatient":
      case "/addRecord":
      case "/grantAccess":
      case "/revokeAccess":
      case "/updatePatientProfile":
        return { data: { success: true, data: body } };

      case "/getAllRecordsByPatientId":
        return {
          data: { success: true, data: mockData.records.filter(r => r.patientId === body.patientId) },
        };

      case "/getPatientsForDoctor":
        return { data: { success: true, data: mockData.patients } };

      case "/getAccessList":
        return { data: { success: true, data: mockData.doctors } };

      case "/fetchLedger":
        return {
          data: {
            success: true,
            data: [
              { blockNumber: 1, txId: "TX001", type: "registerHospital", timestamp: new Date() },
              { blockNumber: 2, txId: "TX002", type: "addRecord", timestamp: new Date() },
            ],
          },
        };

      default:
        return { data: { success: true, message: "Mock endpoint hit" } };
    }
  },

  get: async (url) => {
    console.log(`🟢 Mock GET: ${url}`);
    await delay(500);

    if (url === "/getSystemStats") {
      return {
        data: {
          success: true,
          data: {
            totalHospitals: mockData.hospitals.length,
            totalDoctors: mockData.doctors.length,
            totalPatients: mockData.patients.length,
            totalRecords: mockData.records.length,
          },
        },
      };
    }

    return { data: { success: true, data: [] } };
  },
};

export default api;
