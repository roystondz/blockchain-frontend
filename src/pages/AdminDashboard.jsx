import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Hospital, Users } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import api from "../context/api";
import Spinner from "../components/Spinner";

const AdminDashboard = () => {
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
        console.log("Stats fetched:", res.data.data);
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

  return (
    <DashboardLayout role="admin" userName="Admin">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Total Hospitals */}
        <Card title="Total Hospitals" icon={Hospital}>
          {statsLoading ? (
            <Spinner size={8} color="blue" />
          ) : (
            <p className="text-3xl font-bold text-blue-600">
              {stats?.hospitals || 0}
            </p>
          )}
        </Card>

        {/* Total Doctors */}
        <Card title="Total Doctors" icon={Users}>
          {statsLoading ? (
            <Spinner size={8} color="teal" />
          ) : (
            <p className="text-3xl font-bold text-teal-600">
              {stats?.doctors || 0}
            </p>
          )}
        </Card>

        {/* Total Patients */}
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

      {/* Register Hospital Form */}
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
