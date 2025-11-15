import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hospital, Users } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import api from "../context/api";


const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    adminId: localStorage.getItem('userId') || '',
    hospitalId: '',
    name: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const res = await api.get('/getSystemStats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };
  
  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/registerHospital', formData);
      if (res.data.success) {
        toast.success('Hospital registered successfully!');
        setFormData({ ...formData, hospitalId: '', name: '', city: '' });
        fetchStats();
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
    <DashboardLayout role="admin" userName="Administrator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Total Hospitals" icon={Hospital}>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalHospitals || 0}</p>
        </Card>
        <Card title="Total Doctors" icon={Users}>
          <p className="text-3xl font-bold text-teal-600">{stats?.totalDoctors || 0}</p>
        </Card>
        <Card title="Total Patients" icon={Users}>
          <p className="text-3xl font-bold text-green-600">{stats?.totalPatients || 0}</p>
        </Card>
      </div>
      
      <Card title="Register New Hospital" icon={Hospital}>
        <form onSubmit={handleRegisterHospital}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Hospital ID"
              value={formData.hospitalId}
              onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
              placeholder="HOSP001"
              required
            />
            <InputField
              label="Hospital Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="City General Hospital"
              required
            />
            <InputField
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="New York"
              required
            />
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Hospital'}
            </Button>
          </div>
        </form>
      </Card>

    </DashboardLayout>
  );
};
export default AdminDashboard;