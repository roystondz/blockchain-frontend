import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FileText, Shield, Settings, Users, Calendar, Eye, Trash2, UserCheck } from "lucide-react";
import api from "../context/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Table from "../components/Table";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Button from "../components/Button";


const PatientDashboard = () => {
  const [records, setRecords] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [activeTab, setActiveTab] = useState('records');
  const [showGrantAccess, setShowGrantAccess] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [grantForm, setGrantForm] = useState({
    doctorIdToGrant: '',
    hospitalId: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    dob: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const patientId = localStorage.getItem('userId');
  
  useEffect(() => {
    fetchRecords();
    fetchAccessList();
  }, []);
  
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.post('/getAllRecordsByPatientId', {
        userId: patientId,
        patientId
      });
      if (res.data.success) {
        setRecords(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAccessList = async () => {
    try {
      const res = await api.post('/getAccessList', {
        hospitalId: 'HOSP001', // This should be dynamic based on patient's hospital
        patientId
      });
      if (res.data.success) {
        setAccessList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch access list');
    }
  };
  
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/grantAccess', {
        patientId,
        doctorIdToGrant: grantForm.doctorIdToGrant,
        hospitalId: grantForm.hospitalId
      });
      if (res.data.success) {
        toast.success('Access granted successfully!');
        setShowGrantAccess(false);
        setGrantForm({ doctorIdToGrant: '', hospitalId: '' });
        fetchAccessList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to grant access');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRevokeAccess = async (doctorId) => {
    if (!window.confirm('Are you sure you want to revoke access?')) return;
    
    try {
      const res = await api.post('/revokeAccess', {
        userId: patientId,
        patientId,
        doctorId
      });
      if (res.data.success) {
        toast.success('Access revoked successfully!');
        fetchAccessList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to revoke access');
    }
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/updatePatientProfile', {
        userId: patientId,
        ...profileForm
      });
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        setShowUpdateProfile(false);
        setProfileForm({ name: '', dob: '', city: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout role="patient" userName="Patient">
      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 font-medium ${activeTab === 'records' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            My Records
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-6 py-3 font-medium ${activeTab === 'access' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Access Control
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Profile
          </button>
        </div>
      </div>
      
      {activeTab === 'records' && (
        <Card title="My Medical Records" icon={FileText}>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading records...</p>
          ) : (
            <Table
              headers={['Record ID', 'Date', 'Doctor', 'Diagnosis', 'Prescription', 'Report']}
              data={records}
              renderRow={(record) => (
                <tr key={record.recordId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.recordId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.doctorId}
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
          )}
        </Card>
      )}
      
      {activeTab === 'access' && (
        <Card
          title="Doctor Access Control"
          icon={Shield}
          action={
            <Button onClick={() => setShowGrantAccess(true)}>
              <UserCheck className="w-4 h-4 inline mr-2" />
              Grant Access
            </Button>
          }
        >
          <Table
            headers={['Doctor ID', 'Doctor Name', 'Department', 'Hospital', 'Actions']}
            data={accessList}
            renderRow={(access) => (
              <tr key={access.doctorId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {access.doctorId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {access.doctorName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {access.department || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {access.hospitalName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleRevokeAccess(access.doctorId)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Revoke
                  </button>
                </td>
              </tr>
            )}
          />
        </Card>
      )}
      
      {activeTab === 'profile' && (
        <Card title="Update Profile" icon={Settings}>
          <Button onClick={() => setShowUpdateProfile(true)}>
            Update My Profile
          </Button>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">{patientId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Modal isOpen={showGrantAccess} onClose={() => setShowGrantAccess(false)} title="Grant Doctor Access">
        <form onSubmit={handleGrantAccess}>
          <InputField
            label="Doctor ID"
            value={grantForm.doctorIdToGrant}
            onChange={(e) => setGrantForm({ ...grantForm, doctorIdToGrant: e.target.value })}
            placeholder="DOC001"
            required
          />
          <InputField
            label="Hospital ID"
            value={grantForm.hospitalId}
            onChange={(e) => setGrantForm({ ...grantForm, hospitalId: e.target.value })}
            placeholder="HOSP001"
            required
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Granting...' : 'Grant Access'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowGrantAccess(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      
      <Modal isOpen={showUpdateProfile} onClose={() => setShowUpdateProfile(false)} title="Update Profile">
        <form onSubmit={handleUpdateProfile}>
          <InputField
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            placeholder="John Doe"
            required
          />
          <InputField
            label="Date of Birth"
            type="date"
            value={profileForm.dob}
            onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
            required
          />
          <InputField
            label="City"
            value={profileForm.city}
            onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
            placeholder="New York"
            required
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowUpdateProfile(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default PatientDashboard;