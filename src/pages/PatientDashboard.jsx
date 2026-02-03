import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FileText, Shield, Settings, Eye, Trash2, UserCheck } from "lucide-react";
import api from "../context/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Table from "../components/Table";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Button from "../components/Button";

const PatientDashboard = () => {
  const [showReport, setShowReport] = useState(false);
  const [activeReportHash, setActiveReportHash] = useState("");
  const [reportLoading, setReportLoading] = useState(true);

  const [records, setRecords] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [activeTab, setActiveTab] = useState("records");
  const [showGrantAccess, setShowGrantAccess] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const [grantForm, setGrantForm] = useState({
    doctorIdToGrant: "",
    hospitalId: ""
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    dob: "",
    city: ""
  });

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  // NEW FOR REQUEST HANDLING
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestActionLoading, setRequestActionLoading] = useState(false);

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRecords();
    fetchAccessList();
    fetchProfile();
  }, []);

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await api.post("/getPatientProfile", { userId: patientId });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);

      setProfileForm({
        name: data.name || "",
        dob: data.dob || "",
        city: data.city || ""
      });

    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  // Fetch Patient Records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.post("/getAllRecordsByPatientId", {
        userId: patientId,
        patientId
      });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setRecords(data);
    } catch {
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Access List
  const fetchAccessList = async () => {
    try {
      const res = await api.post("/getAccessList", {
        userId: patientId,
        patientId
      });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setAccessList(data);
    } catch {
      toast.error("Failed to fetch access list");
    }
  };

  // 🔔 Fetch Pending Access Requests
  const fetchAccessRequests = async () => {
    try {
      const res = await api.post("/patient/getAccessRequests", {
        userId: patientId,
        patientId
      });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setPendingRequests(data);
    } catch {
      toast.error("Failed to load access requests");
    }
  };

  // Grant Access
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/grantAccess", {
        patientId,
        doctorIdToGrant: grantForm.doctorIdToGrant,
        hospitalId: grantForm.hospitalId
      });

      if (res.data.success) {
        toast.success("Access granted successfully!");
        setShowGrantAccess(false);
        setGrantForm({ doctorIdToGrant: "", hospitalId: "" });
        fetchAccessList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to grant access");
    } finally {
      setLoading(false);
    }
  };

  // Revoke Access
  const handleRevokeAccess = async (doctorId) => {
    if (!window.confirm("Are you sure you want to revoke access?")) return;

    try {
      const res = await api.post("/revokeAccess", {
        userId: patientId,
        patientId,
        doctorId
      });

      if (res.data.success) {
        toast.success("Access revoked successfully!");
        fetchAccessList();
      }
    } catch {
      toast.error("Failed to revoke access");
    }
  };

  // 🔔 Approve / Reject Access Request
  const handleRequestAction = async (req, action) => {
    setRequestActionLoading(true);

    try {
      await api.post("/patient/updateAccessRequest", {
        patientId,
        doctorId: req.doctorId,
        requestId: req.requestId,
        action
      });

      toast.success(`Request ${action}!`);
      fetchAccessRequests();
      fetchAccessList();
    } catch {
      toast.error("Action failed");
    } finally {
      setRequestActionLoading(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/updatePatientProfile", {
        userId: patientId,
        ...profileForm
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setShowUpdateProfile(false);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredRecords = records.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessList = accessList.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <DashboardLayout role="patient" userName={profileForm.name}>
      {/* Patient Trust Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Your health data is protected by Hyperledger Fabric blockchain technology
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("records")}
          className={`px-6 py-3 ${
            activeTab === "records" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          My Records
        </button>

        <button
          onClick={() => setActiveTab("access")}
          className={`px-6 py-3 ${
            activeTab === "access" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          Access Control
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 ${
            activeTab === "profile" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          Profile
        </button>
      </div>

      {/* -------------------------
          TAB 1: RECORDS
      -------------------------- */}
      {activeTab === "records" && (
        <Card title="My Medical Records" icon={FileText}>
          <input
            type="text"
            placeholder="Search records..."
            className="border px-4 py-2 rounded w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading records...</p>
          ) : (
            <Table
              headers={["Record ID", "Date", "Doctor", "Diagnosis", "Prescription", "Report"]}
              data={filteredRecords}
              renderRow={(record) => (
                <tr key={record.recordId}>
                  <td className="px-6 py-4">{record.recordId}</td>
                  <td className="px-6 py-4">{new Date(record.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{record.doctorId}</td>
                  <td className="px-6 py-4">{record.diagnosis}</td>
                  <td className="px-6 py-4">{record.prescription}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setActiveReportHash(record.reportHash);
                        setReportLoading(true);
                        setShowReport(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      )}

      {/* -------------------------
          TAB 2: ACCESS CONTROL
      -------------------------- */}
      {activeTab === "access" && (
        <Card
          title="Doctor Access Control"
          icon={Shield}
          action={
            <div className="flex gap-3">
              <Button onClick={() => setShowGrantAccess(true)}>
                <UserCheck className="w-4 h-4 inline mr-2" />
                Grant Access
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  fetchAccessRequests();
                  setShowRequestsModal(true);
                }}
              >
                Pending Requests
              </Button>
            </div>
          }
        >
          <input
            type="text"
            placeholder="Search doctor..."
            className="border px-4 py-2 rounded w-full mb-4"
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
          />

          <Table
            headers={["Doctor ID", "Doctor Name", "Department", "Hospital", "Actions"]}
            data={filteredAccessList}
            renderRow={(access) => (
              <tr key={access.doctorId}>
                <td className="px-6 py-4">{access.doctorId}</td>
                <td className="px-6 py-4">{access.doctorName || "N/A"}</td>
                <td className="px-6 py-4">{access.department || "N/A"}</td>
                <td className="px-6 py-4">{access.hospitalName || "N/A"}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRevokeAccess(access.doctorId)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Revoke
                  </button>
                </td>
              </tr>
            )}
          />
        </Card>
      )}

      {/* -------------------------
          TAB 3: PROFILE
      -------------------------- */}
      {activeTab === "profile" && (
        <Card title="Update Profile" icon={Settings}>
          <Button onClick={() => setShowUpdateProfile(true)}>Update My Profile</Button>
        </Card>
      )}

      {/* -------------------------
          MODALS BELOW
      -------------------------- */}

      {/* GRANT ACCESS */}
      <Modal
        isOpen={showGrantAccess}
        onClose={() => setShowGrantAccess(false)}
        title="Grant Doctor Access"
      >
        <form onSubmit={handleGrantAccess}>
          <InputField
            label="Doctor ID"
            value={grantForm.doctorIdToGrant}
            onChange={(e) =>
              setGrantForm({ ...grantForm, doctorIdToGrant: e.target.value })
            }
            placeholder="DOC001"
            required
          />

          <InputField
            label="Hospital ID"
            value={grantForm.hospitalId}
            onChange={(e) =>
              setGrantForm({ ...grantForm, hospitalId: e.target.value })
            }
            placeholder="HOSP001"
            required
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Granting..." : "Grant Access"}
            </Button>

            <Button variant="secondary" onClick={() => setShowGrantAccess(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* UPDATE PROFILE */}
      <Modal
        isOpen={showUpdateProfile}
        onClose={() => setShowUpdateProfile(false)}
        title="Update Profile"
      >
        <form onSubmit={handleUpdateProfile}>
          <InputField
            label="Name"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
            required
          />

          <InputField
            label="Date of Birth"
            type="date"
            value={profileForm.dob}
            onChange={(e) =>
              setProfileForm({ ...profileForm, dob: e.target.value })
            }
            required
          />

          <InputField
            label="City"
            value={profileForm.city}
            onChange={(e) =>
              setProfileForm({ ...profileForm, city: e.target.value })
            }
            required
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>

            <Button variant="secondary" onClick={() => setShowUpdateProfile(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* PENDING REQUESTS MODAL */}
      <Modal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        title="Pending Access Requests"
      >
        {pendingRequests.length === 0 ? (
          <p className="text-center text-gray-500 py-3">No access requests found.</p>
        ) : (
          <Table
            headers={[
              "Request ID",
              "Doctor ID",
              "Hospital",
              "Reason",
              "Status",
              "Actions"
            ]}
            data={pendingRequests}
            renderRow={(req) => (
              <tr key={req.requestId}>
                <td className="px-6 py-3">{req.requestId}</td>
                <td className="px-6 py-3">{req.doctorId}</td>
                <td className="px-6 py-3">{req.hospitalId}</td>
                <td className="px-6 py-3">{req.reason}</td>
                <td className="px-6 py-3 capitalize">{req.status}</td>

                <td className="px-6 py-3 flex gap-2">
                  {req.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleRequestAction(req, "approved")}
                        disabled={requestActionLoading}
                      >
                        {requestActionLoading ? "..." : "Approve"}
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => handleRequestAction(req, "rejected")}
                        disabled={requestActionLoading}
                      >
                        {requestActionLoading ? "..." : "Reject"}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )}
          />
        )}
      </Modal>

      {/* REPORT VIEWER */}
      <Modal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        title="Medical Report"
      >
        {activeReportHash ? (
          <>
            <div className="flex gap-3 mb-4">
              <Button
                onClick={() =>
                  window.open(
                    `https://gateway.pinata.cloud/ipfs/${activeReportHash}`,
                    "_blank"
                  )
                }
              >
                Open in New Tab
              </Button>

              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    const url = `https://gateway.pinata.cloud/ipfs/${activeReportHash}`;
                    const response = await fetch(url);
                    const blob = await response.blob();

                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = blobUrl;

                    const ext = blob.type.includes("pdf")
                      ? "pdf"
                      : blob.type.includes("png")
                      ? "png"
                      : blob.type.includes("jpeg")
                      ? "jpg"
                      : "file";

                    link.download = `MedicalReport.${ext}`;
                    link.click();

                    window.URL.revokeObjectURL(blobUrl);
                  } catch {
                    toast.error("Failed to download the report");
                  }
                }}
              >
                Download
              </Button>
            </div>

            {reportLoading && (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            <iframe
              src={`https://gateway.pinata.cloud/ipfs/${activeReportHash}`}
              className={`w-full h-[600px] rounded border ${
                reportLoading ? "hidden" : "block"
              }`}
              onLoad={() => setReportLoading(false)}
            ></iframe>
          </>
        ) : (
          <p>No report found</p>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientDashboard;
