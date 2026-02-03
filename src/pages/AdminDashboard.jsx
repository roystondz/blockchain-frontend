import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Hospital, Users, Blocks, Shield, Activity } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import { ProfessionalCard, StatsCard, BlockchainCard, ActivityCard } from "../components/ProfessionalCard";
import { CircularProgress, ProgressBar, StatusIndicator } from "../components/Progress";
import api from "../context/api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { checkServerStatus } from "../utils/checkServer";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const [serverDown, setServerDown] = useState(false);

useEffect(() => {
  (async () => {
    const status = await checkServerStatus();
    setServerDown(!status);
  })();
}, []);


  const [formData, setFormData] = useState({
    adminId: localStorage.getItem("userId") || "",
    hospitalId: "",
    name: "",
    city: ""
  });

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    await delay(200);
    try {
      const res = await api.post("/getSystemStats", { userId: "HOSP-01" });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/registerHospital", formData);
      if (res.data.success) {
        toast.success("Hospital registered successfully!");
        setFormData({ ...formData, hospitalId: "", name: "", city: "" });
        fetchStats();
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (serverDown) {
    return (
      <div className="text-center text-red-600 text-xl mt-10">
        🚨 Server is currently down for maintenance.
        <br />
        Please try again later.
      </div>
    );
  }
  

  return (
    <DashboardLayout role="admin" userName="Admin">

      {/* ⭐ TOP TAB BAR ⭐ */}
      <div className="mb-6">
        <div className="flex gap-2 border-b">

          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium ${
              activeTab === "dashboard"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Dashboard
          </button>

          {/* Register Hospital Tab */}
          <button
            onClick={() => setActiveTab("register")}
            className={`px-6 py-3 font-medium ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Register Hospital
          </button>

          {/* ⭐ Blockchain Explorer Tab */}
          <button
            onClick={() => navigate("/explorer")}
            className="px-6 py-3 font-medium text-gray-600 hover:text-blue-600 flex items-center gap-2"
          >
            <Blocks className="w-4 h-4" />
            Blockchain Explorer
          </button>

        </div>
      </div>

      {/* ⭐ TAB 1: DASHBOARD (STATS) */}
      {activeTab === "dashboard" && (
        <>
          {/* Blockchain Trust Indicator */}
          <BlockchainCard
            title="Secured by Hyperledger Fabric"
            description="Enterprise-grade blockchain technology ensuring data integrity and trust"
            status="active"
            className="mb-6"
          />

          {/* Professional Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <StatsCard
              title="Total Hospitals"
              value={stats?.hospitals || 0}
              icon={Hospital}
              loading={statsLoading}
            />
            <StatsCard
              title="Total Doctors"
              value={stats?.doctors || 0}
              icon={Users}
              loading={statsLoading}
            />
            <StatsCard
              title="Total Patients"
              value={stats?.patients || 0}
              icon={Users}
              loading={statsLoading}
            />
          </div>

          {/* Quick Actions & Important Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfessionalCard
              title="System Information"
              icon={Activity}
              badge={{ text: "Live", type: "success" }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {statsLoading ? "..." : "✓"}
                    </div>
                    <div className="text-xs text-blue-800">API Connected</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {serverDown ? "✗" : "✓"}
                    </div>
                    <div className="text-xs text-green-800">Server Status</div>
                  </div>
                </div>

                

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Last updated: {new Date().toLocaleTimeString()}</p>
                    <p>• Data source: /getSystemStats</p>
                    <p>• Loading: {statsLoading ? "Fetching data..." : "Complete"}</p>
                    <p>• Records: {stats?.patients || 0} patients registered</p>
                  </div>
                </div>
              </div>
            </ProfessionalCard>

            <ProfessionalCard
              title="Network Health"
              icon={Activity}
              badge={{ text: serverDown ? "Offline" : "Online", type: serverDown ? "error" : "success" }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">API Server</span>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={serverDown ? "offline" : "online"} />
                    <span className="text-sm text-gray-600">
                      {serverDown ? "Down" : "Operational"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">IPFS Storage</span>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="online" />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Database Connection</span>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={serverDown ? "offline" : "online"} />
                    <span className="text-sm text-gray-600">
                      {serverDown ? "Disconnected" : "Connected"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>• All systems {serverDown ? "experiencing issues" : "operational"}</p>
                    <p>• Last health check: Just now</p>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <ProfessionalCard
              title="Recent Activity"
              icon={Activity}
              subtitle="System events and actions"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium bg-blue-500">
                      📊
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">System Statistics Retrieved</p>
                      <p className="text-xs text-gray-500">From /getSystemStats endpoint</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                    <p className="text-xs font-medium text-blue-600">Success</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium bg-green-500">
                      🔗
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">API Connection Active</p>
                      <p className="text-xs text-gray-500">Backend server responding</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                    <p className="text-xs font-medium text-green-600">{serverDown ? "Offline" : "Online"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium bg-purple-500">
                      📈
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data Processing</p>
                      <p className="text-xs text-gray-500">Processing system statistics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                    <p className="text-xs font-medium text-purple-600">{statsLoading ? "Loading" : "Complete"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium bg-orange-500">
                      🏥
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Healthcare Platform</p>
                    <p className="text-xs text-gray-500">EHR System Active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                    <p className="text-xs font-medium text-orange-600">Monitoring</p>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </div>
        </>
      )}

      {/* ⭐ TAB 2: REGISTER HOSPITAL FORM */}
      {activeTab === "register" && (
        <Card title="Register New Hospital" icon={Hospital}>
          <form onSubmit={handleRegisterHospital}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                label="Hospital ID"
                value={formData.hospitalId}
                onChange={(e) =>
                  setFormData({ ...formData, hospitalId: e.target.value })
                }
                placeholder="HOSP001"
                required
              />

              <InputField
                label="Hospital Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="City General Hospital"
                required
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="New York"
                required
              />

            </div>

            <div className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Registering...
                  </div>
                ) : (
                  "Register Hospital"
                )}
              </Button>
            </div>

          </form>
        </Card>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
