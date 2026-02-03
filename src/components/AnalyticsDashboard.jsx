import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import Card from "../components/Card";
import { Activity, Users, FileText, TrendingUp } from "lucide-react";

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    monthlyRecords: [],
    departmentDistribution: [],
    patientGrowth: [],
    realTimeStats: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API calls
    const mockData = {
      monthlyRecords: [
        { month: 'Jan', records: 45, patients: 12 },
        { month: 'Feb', records: 52, patients: 15 },
        { month: 'Mar', records: 61, patients: 18 },
        { month: 'Apr', records: 73, patients: 22 },
        { month: 'May', records: 85, patients: 28 },
        { month: 'Jun', records: 92, patients: 31 }
      ],
      departmentDistribution: [
        { name: 'Cardiology', value: 30, color: '#3B82F6' },
        { name: 'Neurology', value: 25, color: '#10B981' },
        { name: 'Orthopedics', value: 20, color: '#F59E0B' },
        { name: 'Pediatrics', value: 15, color: '#EF4444' },
        { name: 'General', value: 10, color: '#8B5CF6' }
      ],
      patientGrowth: [
        { month: 'Jan', patients: 120 },
        { month: 'Feb', patients: 135 },
        { month: 'Mar', patients: 158 },
        { month: 'Apr', patients: 189 },
        { month: 'May', patients: 224 },
        { month: 'Jun', patients: 267 }
      ],
      realTimeStats: {
        totalRecords: 408,
        activePatients: 267,
        totalDoctors: 45,
        todayTransactions: 23
      }
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Records" icon={FileText}>
          <div className="text-3xl font-bold text-blue-600">{data.realTimeStats.totalRecords}</div>
          <p className="text-sm text-gray-500 mt-1">Secured on blockchain</p>
        </Card>
        <Card title="Active Patients" icon={Users}>
          <div className="text-3xl font-bold text-green-600">{data.realTimeStats.activePatients}</div>
          <p className="text-sm text-gray-500 mt-1">Registered patients</p>
        </Card>
        <Card title="Total Doctors" icon={Activity}>
          <div className="text-3xl font-bold text-purple-600">{data.realTimeStats.totalDoctors}</div>
          <p className="text-sm text-gray-500 mt-1">Verified doctors</p>
        </Card>
        <Card title="Today's Transactions" icon={TrendingUp}>
          <div className="text-3xl font-bold text-orange-600">{data.realTimeStats.todayTransactions}</div>
          <p className="text-sm text-gray-500 mt-1">Blockchain transactions</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Records Chart */}
        <Card title="Monthly Records & Patients">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyRecords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="records" fill="#3B82F6" name="Records" />
              <Bar dataKey="patients" fill="#10B981" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card title="Department Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.departmentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Patient Growth */}
        <Card title="Patient Growth Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.patientGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Blockchain Activity */}
        <Card title="Blockchain Activity">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium">Network Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="text-sm font-medium">Last Block</span>
              <span className="text-sm text-gray-600">2 minutes ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-sm font-medium">Total Blocks</span>
              <span className="text-sm text-gray-600">1,247</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="text-sm font-medium">Smart Contracts</span>
              <span className="text-sm text-gray-600">8 Active</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
