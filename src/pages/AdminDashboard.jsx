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
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [emergencySubTab, setEmergencySubTab] = useState("pending");
  //const adminId = localStorage.getItem("userId") || "";

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

  // Admin -> Fetch emergency requests by status
const fetchEmergencyRequests = async (status = 'pending') => {
  try {
    const res = await api.get('/emergency/requests', {
      params: { 
        status: status.toUpperCase(), 
        userId: "HOSP-01" 
      }
    });
    if (res.data.success) {
      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];
      
      // Update the specific status array
      if (status === 'pending') {
        setPendingRequests(data);
      } else if (status === 'approved') {
        setApprovedRequests(data);
      } else if (status === 'rejected') {
        setRejectedRequests(data);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch ${status} emergency requests:`, error);
    toast.error(`Failed to load ${status} emergency requests`);
  }
};

// Fetch all emergency requests
const fetchAllEmergencyRequests = async () => {
  setEmergencyLoading(true);
  try {
    await Promise.all([
      fetchEmergencyRequests('pending'),
      fetchEmergencyRequests('approved'),
      fetchEmergencyRequests('rejected')
    ]);
  } catch (error) {
    console.error("Failed to fetch emergency requests:", error);
  } finally {
    setEmergencyLoading(false);
  }
};

// Admin -> Approve or Reject
const decideEmergencyRequest = async (requestId, action) => {
  setProcessingRequest(requestId);
  try {
    const res = await api.post("/admin/emergency/decision", {
      adminId: "HOSP-01",
      requestId,
      action   // APPROVE or REJECT
    });
    
    if (res.data.success) {
      toast.success(`Request ${action.toLowerCase()}ed successfully!`);
      // Refresh all emergency requests after decision
      fetchAllEmergencyRequests();
    } else {
      toast.error(res.data.message || `Failed to ${action.toLowerCase()} request`);
    }
  } catch (error) {
    console.error(`Failed to ${action.toLowerCase()} emergency request:`, error);
    toast.error(`Failed to ${action.toLowerCase()} request`);
  } finally {
    setProcessingRequest(null);
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

          {/* Emergency Requests Tab */}
          <button
            onClick={() => {
              setActiveTab("emergency");
              fetchAllEmergencyRequests();
            }}
            className={`px-6 py-3 font-medium ${
              activeTab === "emergency"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Emergency Requests
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

      {/* ⭐ TAB 3: EMERGENCY REQUESTS */}
      {activeTab === "emergency" && (
        <Card title="Emergency Access Requests" icon={Shield}>
          {/* Emergency Sub-Tabs */}
          <div className="mb-6 flex gap-2 border-b">
            <button
              onClick={() => setEmergencySubTab("pending")}
              className={`px-4 py-2 font-medium ${
                emergencySubTab === "pending"
                  ? "border-b-2 border-yellow-500 text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Pending</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pendingRequests.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setEmergencySubTab("approved")}
              className={`px-4 py-2 font-medium ${
                emergencySubTab === "approved"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Approved</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {approvedRequests.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setEmergencySubTab("rejected")}
              className={`px-4 py-2 font-medium ${
                emergencySubTab === "rejected"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Rejected</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {rejectedRequests.length}
                </span>
              </div>
            </button>
          </div>

          {emergencyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Loading emergency requests...</span>
            </div>
          ) : emergencySubTab === "pending" && pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending emergency requests at this time.</p>
              <p className="text-sm text-gray-500 mt-2">Doctors will appear here when they request emergency access to patient records.</p>
            </div>
          ) : emergencySubTab === "approved" && approvedRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600">No approved emergency requests yet.</p>
              <p className="text-sm text-gray-500 mt-2">Approved emergency requests will appear here.</p>
            </div>
          ) : emergencySubTab === "rejected" && rejectedRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-gray-600">No rejected emergency requests yet.</p>
              <p className="text-sm text-gray-500 mt-2">Rejected emergency requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(emergencySubTab === "pending" ? pendingRequests :
                emergencySubTab === "approved" ? approvedRequests :
                rejectedRequests).map((request, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          request.status?.toLowerCase() === 'approved' ? 'bg-green-100' :
                          request.status?.toLowerCase() === 'rejected' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          <span className={`font-semibold text-sm ${
                            request.status?.toLowerCase() === 'approved' ? 'text-green-600' :
                            request.status?.toLowerCase() === 'rejected' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {request.doctorName?.charAt(0) || 'D'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Dr. {request.doctorName || 'Unknown'}</h4>
                          <p className="text-sm text-gray-600">ID: {request.doctorId || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Patient:</span>
                          <p className="font-medium text-gray-900">{request.patientName || 'Unknown'}</p>
                          <p className="text-gray-600">{request.patientId || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Hospital:</span>
                          <p className="font-medium text-gray-900">{request.hospitalName || 'Unknown'}</p>
                          <p className="text-gray-600">{request.hospitalId || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Requested:</span>
                          <p className="font-medium text-gray-900">
                            {new Date(request.requestTime || Date.now()).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            {Math.floor((Date.now() - new Date(request.requestTime || Date.now())) / (1000 * 60 * 60))} hours ago
                          </p>
                        </div>
                      </div>
                      
                      {request.reason && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm font-medium text-yellow-800">Reason for Emergency Access:</p>
                          <p className="text-sm text-yellow-700 mt-1">{request.reason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status || 'pending'}
                      </span>
                      
                      {request.status?.toLowerCase() === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => decideEmergencyRequest(request.requestId || index, 'APPROVE')}
                            disabled={processingRequest === (request.requestId || index)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingRequest === (request.requestId || index) ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => decideEmergencyRequest(request.requestId || index, 'REJECT')}
                            disabled={processingRequest === (request.requestId || index)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingRequest === (request.requestId || index) ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
