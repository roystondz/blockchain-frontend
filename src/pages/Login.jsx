import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Shield } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../api/api";

// ✅ Helper to get user role from prefix
const getUserRole = (userId) => {
  if (!userId) return null;
  if (userId.startsWith("ADMIN")) return "admin";
  if (userId.startsWith("HOSP")) return "hospital";
  if (userId.startsWith("DOC")) return "doctor";
  if (userId.startsWith("PAT")) return "patient";
  return null;
};

const Login = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter User ID");
      return;
    }

    // ✅ Validate format like HOSP-01, DOC-02, etc.
    const idPattern = /^(ADMIN|HOSP|DOC|PAT)-\d{2}$/;
    if (!idPattern.test(userId)) {
      toast.error("Invalid ID format. Use format like HOSP-01, DOC-02, etc.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", { userId });
      if (res.data.success) {
        localStorage.setItem("userId", userId);
        toast.success("Login successful!");
        const role = getUserRole(userId);
        navigate(`/${role}`);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
            placeholder="Enter your ID (e.g., HOSP-01, DOC-02)"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-medium mb-2">Sample IDs:</p>
          <ul className="space-y-1 text-xs">
            <li>• ADMIN-01 - Admin Portal</li>
            <li>• HOSP-01 - Hospital Portal</li>
            <li>• DOC-01 - Doctor Portal</li>
            <li>• PAT-01 - Patient Portal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
