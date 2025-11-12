import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Users, FileText, Eye, Upload } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import Modal from "../components/Modal";
import InputField from "../components/InputField";


const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    diagnosis: '',
    prescription: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const doctorId = localStorage.getItem('userId');
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.post('/getPatientsForDoctor', { doctorId });
      if (res.data.success) {
        setPatients(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecords = async (patientId) => {
    try {
      const res = await api.post('/getAllRecordsByPatientId', {
        userId: doctorId,
        patientId
      });
      if (res.data.success) {
        setRecords(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch records');
    }
  };
  
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    fetchRecords(patient.patientId);
  };
  
  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!recordForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('doctorId', doctorId);
    formData.append('patientId', selectedPatient.patientId);
    formData.append('diagnosis', recordForm.diagnosis);
    formData.append('prescription', recordForm.prescription);
    formData.append('report', recordForm.file);
    
    try {
      const res = await api.post('/addRecord', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Record added successfully!');
        setShowAddRecord(false);
        setRecordForm({ diagnosis: '', prescription: '', file: null });
        fetchRecords(selectedPatient.patientId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add record');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout role="doctor" userName="Doctor">
      {!selectedPatient ? (
        <Card title="My Patients" icon={Users}>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading patients...</p>
          ) : (
            <Table
              headers={['Patient ID', 'Name', 'DOB', 'City', 'Actions']}
              data={patients}
              renderRow={(patient) => (
                <tr key={patient.patientId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.dob}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button onClick={() => handleViewPatient(patient)} variant="primary">
                      View Records
                    </Button>
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <Button onClick={() => setSelectedPatient(null)} variant="secondary">
              ← Back to Patients
            </Button>
          </div>
          
          <Card
            title={`Records for ${selectedPatient.name}`}
            icon={FileText}
            action={
              <Button onClick={() => setShowAddRecord(true)}>
                <Upload className="w-4 h-4 inline mr-2" />
                Add Record
              </Button>
            }
          >
            <Table
              headers={['Record ID', 'Date', 'Diagnosis', 'Prescription', 'Report']}
              data={records}
              renderRow={(record) => (
                <tr key={record.recordId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.recordId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.diagnosis}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.prescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {record.ipfsHash && (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                    )}
                  </td>
                </tr>
              )}
            />
          </Card>
          
          <Modal isOpen={showAddRecord} onClose={() => setShowAddRecord(false)} title="Add Medical Record">
            <form onSubmit={handleAddRecord}>
              <InputField
                label="Diagnosis"
                value={recordForm.diagnosis}
                onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                placeholder="Patient diagnosis"
                required
              />
              <InputField
                label="Prescription"
                value={recordForm.prescription}
                onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })}
                placeholder="Prescribed medications"
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Report <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setRecordForm({ ...recordForm, file: e.target.files[0] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Uploading...' : 'Add Record'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddRecord(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;