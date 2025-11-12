import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getPatientsForDoctor, addRecord } from '../api/doctor';
import { getAllRecordsByPatientId } from '../api/patient';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { getIPFSUrl } from '../utils/ipfs';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    prescription: '',
    report: null,
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatientsForDoctor(user.userId);
      setPatients(data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (patientId) => {
    try {
      const data = await getAllRecordsByPatientId(user.userId, patientId);
      setRecords(data || []);
    } catch (error) {
      toast.error('Failed to load records');
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    loadRecords(patient.patientId);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.report) {
      toast.error('Please select a report file');
      return;
    }

    try {
      await addRecord(
        user.userId,
        selectedPatient.patientId,
        newRecord.diagnosis,
        newRecord.prescription,
        newRecord.report
      );
      toast.success('Record added successfully!');
      setShowAddModal(false);
      setNewRecord({ diagnosis: '', prescription: '', report: null });
      loadRecords(selectedPatient.patientId);
    } catch (error) {
      toast.error(error.message || 'Failed to add record');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="My Patients" className="lg:col-span-1">
          {patients.length === 0 ? (
            <p className="text-gray-500 text-sm">No patients assigned</p>
          ) : (
            <div className="space-y-2">
              {patients.map((patient) => (
                <button
                  key={patient.patientId}
                  onClick={() => handleSelectPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPatient?.patientId === patient.patientId
                      ? 'bg-blue-50 border-2 border-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium text-gray-800">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.patientId}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card title="Patient Records" className="lg:col-span-2">
          {!selectedPatient ? (
            <p className="text-gray-500 text-center py-8">Select a patient to view records</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPatient.patientId}</p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>Add Record</Button>
              </div>

              <div className="space-y-4">
                {records.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No records found</p>
                ) : (
                  records.map((record) => (
                    <div key={record.recordId} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-gray-600">{record.recordId}</span>
                        {record.ipfsHash && (
                          <a
                            href={getIPFSUrl(record.ipfsHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Report →
                          </a>
                        )}
                      </div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Prescription:</span> {record.prescription}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Medical Record"
      >
        <form onSubmit={handleAddRecord}>
          <Input
            label="Diagnosis"
            value={newRecord.diagnosis}
            onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
            required
          />
          <Input
            label="Prescription"
            value={newRecord.prescription}
            onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report File
            </label>
            <input
              type="file"
              onChange={(e) => setNewRecord({ ...newRecord, report: e.target.files[0] })}
              className="w-full"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Add Record</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;