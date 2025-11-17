import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Hospital, Users, FileText, Database } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import api from "../context/api";

const LedgerStats = () => {
  const [ledger, setLedger] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = "HOSP-01"; // replace later with localStorage if needed
  const role = "hospital";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ledgerRes, statsRes] = await Promise.all([
        api.post("/fetchLedger", { userId }),
        api.post("/getSystemStats", { userId }),
      ]);

      if (ledgerRes.data.success) {
        setLedger(ledgerRes.data.data || []);
        console.log(ledgerRes);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={role} userName="User">
      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total Hospitals" icon={Hospital}>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.hospitals || 0}
          </p>
        </Card>
        <Card title="Total Doctors" icon={Users}>
          <p className="text-3xl font-bold text-teal-600">
            {stats?.doctors || 0}
          </p>
        </Card>
        <Card title="Total Patients" icon={Users}>
          <p className="text-3xl font-bold text-green-600">
            {stats?.patients || 0}
          </p>
        </Card>
        <Card title="Total Records" icon={FileText}>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.records || 0}
          </p>
        </Card>
      </div>

      {/* Ledger List */}
      <Card title="Blockchain Ledger" icon={Database}>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading ledger...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              
            {ledger.map((entry, idx) => (
  <div
    key={idx}
    className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4"
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-2">
      <span className="text-sm font-medium text-gray-900">
        Entry #{idx + 1} — {entry.type.toUpperCase()}
      </span>
      <span className="text-xs text-gray-500">
      {entry.value.timestamp ? (
  (() => {
    const ts = entry.value.timestamp;

    // If ts is numeric (UNIX seconds)
    if (!isNaN(ts)) {
      const num = Number(ts);
      if (!isNaN(num)) {
        return new Date(num * 1000).toLocaleString();
      }
    }

    // If ts is ISO date string
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString();
    }

    return "Invalid timestamp";
  })()
) : ""}

      </span>
    </div>

    {/* Entry Details */}
    <div className="text-xs text-gray-600 break-all gap-1 space-y-1 ">

      {/* Show KEY */}
      <p>
        <strong>Ledger Key:</strong> {entry.key}
      </p>

      {/* Record ID */}
      {entry.type === "record" && (
        <>
          <p><strong>Record ID:</strong> {entry.value.recordId}</p>
          <p><strong>Doctor:</strong> {entry.value.doctorId}</p>
          <p><strong>Patient:</strong> {entry.value.patientId}</p>
        </>
      )}

      {/* Doctor */}
      {entry.type === "doctor" && (
        <>
          <p><strong>Doctor ID:</strong> {entry.value.doctorId}</p>
          <p><strong>Name:</strong> {entry.value.name}</p>
          <p><strong>Department:</strong> {entry.value.department}</p>
          <p><strong>Hospital:</strong> {entry.value.hospitalName}</p>
        </>
      )}

      {/* Patient */}
      {entry.type === "patient" && (
        <>
          <p><strong>Patient ID:</strong> {entry.value.patientId}</p>
          <p><strong>Name:</strong> {entry.value.name}</p>
          <p><strong>DOB:</strong> {entry.value.dob}</p>
          <p><strong>City:</strong> {entry.value.city}</p>
        </>
      )}

      {/* Hospital */}
      {entry.type === "hospital" && (
        <>
          <p><strong>Hospital ID:</strong> {entry.value.hospitalId}</p>
          <p><strong>Name:</strong> {entry.value.name}</p>
          <p><strong>City:</strong> {entry.value.city}</p>
        </>
      )}

    </div>
  </div>
))}

            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default LedgerStats;
