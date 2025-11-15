import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import api from "../context/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";


const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctor');
  const [doctorForm, setDoctorForm] = useState({
    hospitalId: localStorage.getItem('userId') || '',
    doctorId: '',
    hospitalName: '',
    name: '',
    department: '',
    city: ''
  });
  const [patientForm, setPatientForm] = useState({
    hospitalId: localStorage.getItem('userId') || '',
    patientId: '',
    hospitalName: '',
    name: '',
    dob: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/registerDoctor', doctorForm);
      if (res.data.success) {
        toast.success('Doctor registered successfully!');
        setDoctorForm({ ...doctorForm, doctorId: '', name: '', department: '' });
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/registerPatient', patientForm);
      if (res.data.success) {
        toast.success('Patient registered successfully!');
        setPatientForm({ ...patientForm, patientId: '', name: '', dob: '' });
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout role="hospital" userName="Hospital Admin">
      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-6 py-3 font-medium ${activeTab === 'doctor' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Register Doctor
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-6 py-3 font-medium ${activeTab === 'patient' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Register Patient
          </button>
        </div>
      </div>
      
      {activeTab === 'doctor' && (
        <Card title="Register New Doctor" icon={UserPlus}>
          <form onSubmit={handleRegisterDoctor}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Doctor ID"
                value={doctorForm.doctorId}
                onChange={(e) => setDoctorForm({ ...doctorForm, doctorId: e.target.value })}
                placeholder="DOC001"
                required
              />
              <InputField
                label="Doctor Name"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                placeholder="Dr. John Smith"
                required
              />
              <InputField
                label="Hospital Name"
                value={doctorForm.hospitalName}
                onChange={(e) => setDoctorForm({ ...doctorForm, hospitalName: e.target.value })}
                placeholder="City General Hospital"
                required
              />
              <InputField
                label="Department"
                value={doctorForm.department}
                onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                placeholder="Cardiology"
                required
              />
              <InputField
                label="City"
                value={doctorForm.city}
                onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
                placeholder="New York"
                required
              />
            </div>
            <div className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Doctor'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {activeTab === 'patient' && (
        <Card title="Register New Patient" icon={UserPlus}>
          <form onSubmit={handleRegisterPatient}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Patient ID"
                value={patientForm.patientId}
                onChange={(e) => setPatientForm({ ...patientForm, patientId: e.target.value })}
                placeholder="PAT001"
                required
              />
              <InputField
                label="Patient Name"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                placeholder="Jane Doe"
                required
              />
              <InputField
                label="Hospital Name"
                value={patientForm.hospitalName}
                onChange={(e) => setPatientForm({ ...patientForm, hospitalName: e.target.value })}
                placeholder="City General Hospital"
                required
              />
              <InputField
                label="Date of Birth"
                type="date"
                value={patientForm.dob}
                onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
                required
              />
              <InputField
                label="City"
                value={patientForm.city}
                onChange={(e) => setPatientForm({ ...patientForm, city: e.target.value })}
                placeholder="New York"
                required
              />
            </div>
            <div className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Patient'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </DashboardLayout>
  );
};
export default HospitalDashboard;