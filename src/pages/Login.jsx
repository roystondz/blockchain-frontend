import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../api/auth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      await loginAPI(userId);
      const role = login(userId);
      toast.success(`Welcome! Logged in as ${role}`);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg className="h-16 w-16 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800">MediChain</h1>
          <p className="text-gray-600 mt-2">Blockchain-based Healthcare Management</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID (e.g., PAT001, DOC001, HOSP001)"
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p className="font-medium mb-2">Sample User IDs:</p>
          <ul className="space-y-1">
            <li>• <span className="font-mono">PAT001</span> - Patient</li>
            <li>• <span className="font-mono">DOC001</span> - Doctor</li>
            <li>• <span className="font-mono">HOSP001</span> - Hospital Admin</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Login;