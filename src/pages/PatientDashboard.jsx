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

  // ---------------------------------------------
  // 🔍 ADDED SEARCH STATES
  // ---------------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRecords();
    fetchAccessList();
    fetchProfile();
  }, []);

  // ---------------------------------------------
  // Fetch Profile
  // ---------------------------------------------
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
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    }
  };

  // ---------------------------------------------
  // Fetch Records
  // ---------------------------------------------
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.post("/getAllRecordsByPatientId", {
        userId: patientId,
        patientId
      });

      let data = res.data.data;

      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      if (!Array.isArray(data)) data = [];

      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Fetch Access List
  // ---------------------------------------------
  const fetchAccessList = async () => {
    try {
      const res = await api.post("/getAccessList", {
        userId: patientId,
        patientId
      });

      let data = res.data.data;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      if (!Array.isArray(data)) data = [];

      setAccessList(data);
    } catch (error) {
      console.error("Failed to fetch access list:", error);
      toast.error("Failed to fetch access list");
    }
  };

  // ---------------------------------------------
  // Grant Access
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Revoke Access
  // ---------------------------------------------
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke access");
    }
  };

  // ---------------------------------------------
  // Update Profile
  // ---------------------------------------------
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
        setProfileForm({ name: "", dob: "", city: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // 🔍 FILTER LOGIC (ADDED)
  // ---------------------------------------------
  const filteredRecords = records.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessList = accessList.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <DashboardLayout role="patient" userName="Patient">
      {/* TABS */}
      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-6 py-3 font-medium ${
              activeTab === "records"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            My Records
          </button>

          <button
            onClick={() => setActiveTab("access")}
            className={`px-6 py-3 font-medium ${
              activeTab === "access"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Access Control
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* =============================================
          TAB 1 — RECORDS
      ============================================= */}
      {activeTab === "records" && (
        <Card title="My Medical Records" icon={FileText}>
          {/* 🔍 Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search records..."
              className="border px-4 py-2 rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading records...</p>
          ) : (
            <Table
              headers={[
                "Record ID",
                "Date",
                "Doctor",
                "Diagnosis",
                "Prescription",
                "Report"
              ]}
              data={filteredRecords} // ⬅ UPDATED
              renderRow={(record) => (
                <tr key={record.recordId}>
                  <td className="px-6 py-4">{record.recordId}</td>
                  <td className="px-6 py-4">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{record.doctorId}</td>
                  <td className="px-6 py-4">{record.diagnosis}</td>
                  <td className="px-6 py-4">{record.prescription}</td>
                  <td className="px-6 py-4">
                    {record.reportHash && (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${record.reportHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                    )}
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      )}

      {/* =============================================
          TAB 2 — ACCESS CONTROL
      ============================================= */}
      {activeTab === "access" && (
        <Card
          title="Doctor Access Control"
          icon={Shield}
          action={
            <Button onClick={() => setShowGrantAccess(true)}>
              <UserCheck className="w-4 h-4 inline mr-2" />
              Grant Access
            </Button>
          }
        >
          {/* 🔍 Doctor Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search doctor..."
              className="border px-4 py-2 rounded w-full"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
            />
          </div>

          <Table
            headers={[
              "Doctor ID",
              "Doctor Name",
              "Department",
              "Hospital",
              "Actions"
            ]}
            data={filteredAccessList} // ⬅ UPDATED
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
                    <Trash2 className="w-4 h-4" />
                    Revoke
                  </button>
                </td>
              </tr>
            )}
          />
        </Card>
      )}

      {/* =============================================
          TAB 3 — PROFILE
      ============================================= */}
      {activeTab === "profile" && (
        <Card title="Update Profile" icon={Settings}>
          <Button onClick={() => setShowUpdateProfile(true)}>
            Update My Profile
          </Button>
        </Card>
      )}

      {/* =============================================
          MODAL — GRANT ACCESS
      ============================================= */}
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowGrantAccess(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* =============================================
          MODAL — UPDATE PROFILE
      ============================================= */}
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
            placeholder="John Doe"
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
            placeholder="New York"
            required
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowUpdateProfile(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default PatientDashboard;
