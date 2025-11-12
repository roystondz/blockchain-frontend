import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getAllRecordsByPatientId,
  updatePatientProfile,
  grantAccess,
  revokeAccess,
  getAccessList,
} from '../api/patient';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Spinner from '../components/Spinner';
import { getIPFSUrl } from '../utils/ipfs';

const PatientDashboard = () => {
  const [records, setRecords] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: '',
    dob: '',
    city: '',
  });

  const [grantForm, setGrantForm] = useState({
    doctorIdToGrant: '',
    hospitalId: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getAllRecordsByPatientId(user.userId, user.userId);
      setRecords(data || []);
    } catch (error) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const loadAccessList = async (hospitalId) => {
    try {
      const data = await getAccessList(hospitalId, user.userId);
      setAccessList(data || []);
    } catch (error) {
      toast.error('Failed to load access list');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updatePatientProfile(
        user.userId,
        profileForm.name,
        profileForm.dob,
        profileForm.city
      );
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    try {
      await grantAccess(
        user.userId,
        grantForm.doctorIdToGrant,
        grantForm.hospitalId
      );
      toast.success('Access granted successfully!');
      setGrantForm({ doctorIdToGrant: '', hospitalId: '' });
      if (grantForm.hospitalId) loadAccessList(grantForm.hospitalId);
    } catch (error) {
      toast.error(error.message || 'Failed to grant access');
    }
  };

  const handleRevokeAccess = async (doctorId) => {
    try {
      await revokeAccess(user.userId, user.userId, doctorId);
      toast.success('Access revoked successfully!');
      if (grantForm.hospitalId) loadAccessList(grantForm.hospitalId);
    } catch (error) {
      toast.error(error.message || 'Failed to revoke access');
    }
  };

  const tabs = [
    { id: 'records', label: 'My Records' },
    { id: 'profile', label: 'Update Profile' },
    { id: 'access', label: 'Access Management' },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'records' && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medical records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Record ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Diagnosis</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prescription</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {records.map((record) => (
                      <tr key={record.recordId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{record.recordId}</td>
                        <td className="px-4 py-3 text-sm">{record.diagnosis}</td>
                        <td className="px-4 py-3 text-sm">{record.prescription}</td>
                        <td className="px-4 py-3 text-sm">
                          {record.ipfsHash ? (
                            <a
                              href={getIPFSUrl(record.ipfsHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              View →
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile}>
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={profileForm.dob}
              onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
              required
            />
            <Input
              label="City"
              value={profileForm.city}
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              required
            />
            <Button type="submit">Update Profile</Button>
          </form>
        )}

        {activeTab === 'access' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Grant Doctor Access</h4>
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <Input
                  label="Hospital ID"
                  value={grantForm.hospitalId}
                  onChange={(e) => setGrantForm({ ...grantForm, hospitalId: e.target.value })}
                  placeholder="e.g., HOSP001"
                  required
                />
                <Input
                  label="Doctor ID"
                  value={grantForm.doctorIdToGrant}
                  onChange={(e) => setGrantForm({ ...grantForm, doctorIdToGrant: e.target.value })}
                  placeholder="e.g., DOC001"
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="success">Grant Access</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => grantForm.hospitalId && loadAccessList(grantForm.hospitalId)}
                  >
                    Load Access List
                  </Button>
                </div>
              </form>
            </div>

            {accessList.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Doctors with Access</h4>
                <div className="space-y-2">
                  {accessList.map((doctor) => (
                    <div
                      key={doctor.doctorId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{doctor.name || doctor.doctorId}</p>
                        <p className="text-sm text-gray-600">{doctor.doctorId}</p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleRevokeAccess(doctor.doctorId)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientDashboard;