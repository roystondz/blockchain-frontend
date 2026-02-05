import React, { useState, useEffect } from "react";
import api from "../context/api";
import { toast } from "react-hot-toast";
import {
  Users,
  FileText,
  Eye,
  Upload,
  KeyRound,
  Search,
  Shield,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import DataTable from "../components/DataTable";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { CircularProgress, StatusIndicator } from "../components/Progress";

const DoctorDashboard = () => {
  const doctorId = localStorage.getItem("userId");

  const [activeTab, setActiveTab] = useState("mypatients");

  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [requestPatient, setRequestPatient] = useState(null);

  const [records, setRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showRequestAccess, setShowRequestAccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    department: "",
    hospitalId: "",
    hospitalName: "",
  });

  // NEW: Loading states for buttons
  const [requestLoading, setRequestLoading] = useState(false);
  const [addRecordLoading, setAddRecordLoading] = useState(false);

  const [recordForm, setRecordForm] = useState({
    diagnosis: "",
    prescription: "",
    file: null,
  });

  useEffect(() => {
    fetchDoctorInfo();
    fetchMyPatients();
    fetchAllPatients();
  }, []);

  // -----------------------------------
  // GET DOCTOR INFO
  // -----------------------------------
  const fetchDoctorInfo = async () => {
    try {
      const res = await api.post("/getDoctorInfo", {
        doctorId,
        userId: doctorId,
      });

      if (res.data.success) {
        const d = res.data.data;
        setDoctorInfo({
          name: d.name,
          department: d.department,
          hospitalId: d.hospitalId,
          hospitalName: d.hospitalName,
        });
      }
    } catch {
      toast.error("Failed loading doctor info");
    }
  };

  // -----------------------------------
  // FETCH MY PATIENTS
  // -----------------------------------
  const fetchMyPatients = async () => {
    try {
      const res = await api.post("/getPatientsForDoctor", { doctorId });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setMyPatients(data);
    } catch {
      toast.error("Unable to load your patients");
    }
  };

  // -----------------------------------
  // FETCH ALL PATIENTS
  // -----------------------------------
  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/getAllPatients");

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setAllPatients(data);
    } catch {
      toast.error("Unable to load all patients");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // VIEW PATIENT RECORDS (My Patients → Always allowed)
  // -----------------------------------
  const handleViewPatient = async (patient, fromMyPatients = false) => {
    try {
      if (fromMyPatients) {
        setSelectedPatient(patient);
        fetchRecords(patient.patientId);
        return;
      }

      // Check access for ALL patients
      const res = await api.post("/doctor/checkAccess", {
        doctorId,
        patientId: patient.patientId,
      });

      if (res.data.access === true) {
        setSelectedPatient(patient);
        fetchRecords(patient.patientId);
      } else {
        toast.error("Access denied. Request access first.");
      }
    } catch {
      toast.error("Error checking access");
    }
  };

  // -----------------------------------
  // FETCH RECORDS
  // -----------------------------------
  const fetchRecords = async (patientId) => {
    try {
      const res = await api.post("/getAllRecordsByPatientId", {
        userId: doctorId,
        patientId,
      });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setRecords(data);
    } catch {
      toast.error("Could not load records");
    }
  };

  // -----------------------------------
  // SEND ACCESS REQUEST (with loading)
  // -----------------------------------
  const sendAccessRequest = async () => {
    setRequestLoading(true);
    try {
      await api.post("/doctor/requestAccess", {
        doctorId,
        patientId: requestPatient.patientId,
        hospitalId: doctorInfo.hospitalId,
        reason: "Need access for consultation",
      });

      toast.success("Access request sent!");
      setShowRequestAccess(false);
      setRequestPatient(null);
    } catch {
      toast.error("Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  // -----------------------------------
  // ADD RECORD (with loading)
  // -----------------------------------
  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!recordForm.file) return toast.error("Please upload a file");

    setAddRecordLoading(true);

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("patientId", selectedPatient.patientId);
    formData.append("diagnosis", recordForm.diagnosis);
    formData.append("prescription", recordForm.prescription);
    formData.append("report", recordForm.file);

    try {
      await api.post("/addRecord", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record added");
      setShowAddRecord(false);
      setRecordForm({ diagnosis: "", prescription: "", file: null });
      fetchRecords(selectedPatient.patientId);
    } catch {
      toast.error("Failed adding record");
    } finally {
      setAddRecordLoading(false);
    }
  };

  // -----------------------------------
  // FILTER LOGIC
  // -----------------------------------
  const myPatientIds = new Set(myPatients.map((p) => p.patientId));

  const filteredAllPatients = allPatients.filter((p) => !myPatientIds.has(p.patientId));

  return (
    <DashboardLayout role="doctor" userName={`Dr. ${doctorInfo.name}`}>
      {/* Blockchain Trust Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Medical records secured by Hyperledger Fabric blockchain
          </span>
        </div>
      </div>

      {/* TOP TABS */}
      <div className="mb-6 flex gap-3 border-b">
        <button
          onClick={() => setActiveTab("mypatients")}
          className={`px-6 py-3 ${
            activeTab === "mypatients"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          My Patients
        </button>

        <button
          onClick={() => setActiveTab("allpatients")}
          className={`px-6 py-3 ${
            activeTab === "allpatients"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Search All Patients
        </button>
      </div>

      {/* ==================== MY PATIENTS ==================== */}
      {activeTab === "mypatients" && !selectedPatient && (
        <ProfessionalCard 
          title="My Patients" 
          icon={Users}
          badge={{ text: `${myPatients.length} patients`, type: 'info' }}
        >
          <DataTable
            data={myPatients}
            columns={[
              {
                header: "Patient ID",
                accessor: "patientId",
                sortable: true,
                filterable: true
              },
              {
                header: "Name",
                accessor: "name",
                sortable: true,
                filterable: true
              },
              {
                header: "City",
                accessor: "city",
                sortable: true,
                filterable: true
              },
              {
                header: "Status",
                accessor: "status",
                type: "status",
                render: (value) => (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {value || 'Active'}
                  </span>
                )
              },
              {
                header: "Actions",
                accessor: "actions",
                render: (_, row) => (
                  <Button 
                    size="sm" 
                    onClick={() => handleViewPatient(row, true)}
                    loading={loading}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Records
                  </Button>
                )
              }
            ]}
            searchable={true}
            filterable={true}
            exportable={true}
            loading={loading}
            pagination={true}
          />
        </ProfessionalCard>
      )}

      {/* ==================== SEARCH ALL PATIENTS ==================== */}
      {activeTab === "allpatients" && !selectedPatient && (
        <ProfessionalCard 
          title="Search All Patients" 
          icon={Search}
          badge={{ text: `${filteredAllPatients.length} available`, type: 'info' }}
        >
          <DataTable
            data={filteredAllPatients}
            columns={[
              {
                header: "Patient ID",
                accessor: "patientId",
                sortable: true,
                filterable: true
              },
              {
                header: "Name",
                accessor: "name",
                sortable: true,
                filterable: true
              },
              {
                header: "City",
                accessor: "city",
                sortable: true,
                filterable: true
              },
              // {
              //   header: "Hospital",
              //   accessor: "hospitalName",
              //   sortable: true,
              //   filterable: true
              // },
              {
                header: "Actions",
                accessor: "actions",
                render: (_, row) => (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        setRequestPatient(row);
                        setShowRequestAccess(true);
                      }}
                      loading={requestLoading}
                    >
                      <KeyRound className="w-4 h-4 mr-1" />
                      Request Access
                    </Button>
                  </div>
                )
              }
            ]}
            searchable={true}
            filterable={true}
            exportable={true}
            loading={loading}
            pagination={true}
          />
        </ProfessionalCard>
      )}

      {/* ==================== PATIENT RECORDS ==================== */}
      {selectedPatient && (
        <>
          <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
            ← Back
          </Button>

          <Card
            title={`Records for ${selectedPatient.name}`}
            icon={FileText}
            action={
              <Button onClick={() => setShowAddRecord(true)}>
                <Upload className="w-4 h-4 mr-2" /> Add Record
              </Button>
            }
          >
            <Table
              headers={["ID", "Date", "Diagnosis", "Prescription", "Report"]}
              data={records}
              renderRow={(r) => (
                <tr key={r.recordId}>
                  <td className="px-6 py-3">{r.recordId}</td>
                  <td className="px-6 py-3">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{r.diagnosis}</td>
                  <td className="px-6 py-3">{r.prescription}</td>
                  <td className="px-6 py-3">
                    {r.reportHash && (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${r.reportHash}`}
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        <Eye className="inline w-4 h-4 mr-1" /> View
                      </a>
                    )}
                  </td>
                </tr>
              )}
            />
          </Card>
        </>
      )}

      {/* ==================== REQUEST ACCESS MODAL ==================== */}
      <Modal
        isOpen={showRequestAccess}
        onClose={() => setShowRequestAccess(false)}
        title="Request Patient Access"
      >
        <p>
          Requesting access to <b>{requestPatient?.name}</b>
        </p>

        <p className="text-sm mb-4">
          Hospital: <b>{doctorInfo.hospitalName}</b> ({doctorInfo.hospitalId})
        </p>

        <Button
          className="w-full"
          onClick={sendAccessRequest}
          disabled={requestLoading}
        >
          {requestLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Sending...
            </div>
          ) : (
            "Send Request"
          )}
        </Button>
      </Modal>

      {/* ==================== ADD RECORD MODAL ==================== */}
      <Modal
        isOpen={showAddRecord}
        onClose={() => setShowAddRecord(false)}
        title="Add Medical Record"
      >
        <form onSubmit={handleAddRecord}>
          <InputField
            label="Diagnosis"
            value={recordForm.diagnosis}
            onChange={(e) =>
              setRecordForm({ ...recordForm, diagnosis: e.target.value })
            }
            required
          />

          <InputField
            label="Prescription"
            value={recordForm.prescription}
            onChange={(e) =>
              setRecordForm({ ...recordForm, prescription: e.target.value })
            }
            required
          />

          <input
            type="file"
            className="border px-3 py-2 rounded w-full mb-4"
            onChange={(e) =>
              setRecordForm({ ...recordForm, file: e.target.files[0] })
            }
            required
          />

          <Button type="submit" disabled={addRecordLoading}>
            {addRecordLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Uploading...
              </div>
            ) : (
              "Add Record"
            )}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
