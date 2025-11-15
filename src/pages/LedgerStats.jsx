import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hospital, Users, FileText, Database } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import getUserRole from "../utils/getUserRole";

import api from "../context/api";
const LedgerStats = () => {
  const [ledger, setLedger] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const role = getUserRole(userId);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ledgerRes, statsRes] = await Promise.all([
        api.post('/fetchLedger', { userId }),
        api.get('/getSystemStats')
      ]);
      
      if (ledgerRes.data.success) {
        setLedger(ledgerRes.data.data || []);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout role={role} userName="User">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total Hospitals" icon={Hospital}>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalHospitals || 0}</p>
        </Card>
        <Card title="Total Doctors" icon={Users}>
          <p className="text-3xl font-bold text-teal-600">{stats?.totalDoctors || 0}</p>
        </Card>
        <Card title="Total Patients" icon={Users}>
          <p className="text-3xl font-bold text-green-600">{stats?.totalPatients || 0}</p>
        </Card>
        <Card title="Total Records" icon={FileText}>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalRecords || 0}</p>
        </Card>
      </div>
      
      <Card title="Blockchain Ledger" icon={Database}>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading ledger...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              {ledger.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No ledger entries found</p>
              ) : (
                <div className="space-y-3">
                  {ledger.map((entry, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Block #{entry.blockNumber || idx}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 break-all">
                        <p><strong>Transaction ID:</strong> {entry.txId}</p>
                        <p className="mt-1"><strong>Type:</strong> {entry.type || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default LedgerStats