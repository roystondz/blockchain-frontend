import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Shield } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import getUserRole from "../utils/getUserRole";
import api from "../context/api";
import { checkServerStatus } from "../utils/checkServer";

const Login = () => {
  const [serverDown, setServerDown] = useState(false);
  const toastShownRef = useRef(false);

useEffect(() => {
  (async () => {
    const status = await checkServerStatus();

    if (!status && !toastShownRef.current) {
      toastShownRef.current = true;   // Prevent double toast
      toast.error("🚨 Server is down or under maintenance.");
    }

    setServerDown(!status);
  })();
}, []);
  
  

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter User ID");
      return;
    }

    // Validate format like ADMIN-01, HOSP-01, DOC-01, PAT-01
  const idPattern = /^(hospitalAdmin|HOSP-\d{2}|DOC-\d{4}|PAT-\d{8})$/;

    if (!idPattern.test(userId)) {
      toast.error("Invalid ID format. Use format like HOSP-01, DOC-02, etc.");
      return;
    }

    setLoading(true);
    try {
      const mockMode = false; // 🔧 set false when backend is ready

      if (mockMode) {
        localStorage.setItem("userId", userId);
        const role = getUserRole(userId);
        toast.success(` login successful as ${role}!`);
        navigate(`/${role}`);
        return;
      }

      // Real API mode (for when backend is running)
      const res = await api.post("/login", { userId });
      if (res.data.success) {
        localStorage.setItem("userId", userId);
        const role = getUserRole(userId);
        toast.success("Login successful!");
        navigate(`/${role}`);
      } else if(res.data.status == "inactive") {
        toast.error(res.data.message || "Login failed -> Account Deactivated");
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
            <li>• hospitalAdmin - Admin Portal</li>
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
