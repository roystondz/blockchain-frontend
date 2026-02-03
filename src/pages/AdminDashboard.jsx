import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Hospital, Users, Blocks, Shield } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import api from "../context/api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom"; // ⭐ Added for redirect
import { checkServerStatus } from "../utils/checkServer";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // ⭐ NEW
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">Secured by Hyperledger Fabric</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade blockchain technology ensuring data integrity and trust</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/explorer")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Blocks className="w-4 h-4" />
                Explore Ledger
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <Card title="Total Hospitals" icon={Hospital}>
              {statsLoading ? (
                <Spinner size={8} color="blue" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.hospitals || 0}
                </p>
              )}
            </Card>

            <Card title="Total Doctors" icon={Users}>
              {statsLoading ? (
                <Spinner size={8} color="teal" />
              ) : (
                <p className="text-3xl font-bold text-teal-600">
                  {stats?.doctors || 0}
                </p>
              )}
            </Card>

            <Card title="Total Patients" icon={Users}>
              {statsLoading ? (
                <Spinner size={8} color="green" />
              ) : (
                <p className="text-3xl font-bold text-green-600">
                  {stats?.patients || 0}
                </p>
              )}
            </Card>

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
