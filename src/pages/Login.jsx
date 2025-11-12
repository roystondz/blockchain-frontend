import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Home, Hospital, Users, Shield } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
const Login = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      toast.error('Please enter User ID');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/login', { userId });
      if (res.data.success) {
        localStorage.setItem('userId', userId);
        toast.success('Login successful!');
        
        const role = getUserRole(userId);
        navigate(`/${role}`);
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">EHR System</h1>
          <p className="text-gray-600 mt-2">Blockchain-powered Healthcare</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <InputField
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID (ADMIN/HOSP/DOC/PAT...)"
            required
          />
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="font-medium mb-2">Sample IDs:</p>
          <ul className="space-y-1 text-xs">
            <li>• ADMIN001 - Admin Portal</li>
            <li>• HOSP001 - Hospital Portal</li>
            <li>• DOC001 - Doctor Portal</li>
            <li>• PAT001 - Patient Portal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;