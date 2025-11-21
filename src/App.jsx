import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import LedgerStats from './pages/LedgerStats';
import BlockchainExplorer from './pages/BlockchainExplorer';
import Dochos from './pages/DoctorHospitals'
const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/explorer"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <BlockchainExplorer />
    </ProtectedRoute>
  }
/>

        <Route
          path="/showhos"
          element={
          <ProtectedRoute allowedRoles={['admin']}><Dochos /></ProtectedRoute>
              
           
          }
        />
        
        <Route
          path="/hospital"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <LedgerStats />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App