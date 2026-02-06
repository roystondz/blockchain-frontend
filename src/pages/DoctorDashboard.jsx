import React, { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
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
const [emergencyPatient, setEmergencyPatient] = useState(null);

  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [requestPatient, setRequestPatient] = useState(null);

  const [records, setRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showRequestAccess, setShowRequestAccess] = useState(false);

  const [emergencyPatientId, setEmergencyPatientId] = useState(null);
  const [selectedEmergencyPatient, setSelectedEmergencyPatient] = useState(null);

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

  // -----------------------------------
  // FETCH MY EMERGENCY ACCESS
  // -----------------------------------
  const fetchMyEmergencyAccess = useCallback(async () => {
    try {
      const res = await api.get("/doctor/emergency/my-access", {
        params: { doctorId }
      });

      console.log("Emergency access API response:", res.data);

      if (res.data.success && res.data.data.length > 0) {
        const access = res.data.data[0]; // assuming one active emergency

        console.log("Emergency access received:", access);

        setEmergencyPatientId(access.patientId); // 🔑 THIS IS THE KEY
        console.log("Set emergencyPatientId to:", access.patientId);
        
        toast.success("Emergency access approved");
      } else {
        console.log("No emergency access found");
        setEmergencyPatient(null);
      }
    } catch (err) {
      console.error("Error fetching emergency access:", err);
      setEmergencyPatient(null);
    }
  }, [doctorId]);

  // -----------------------------------
  // GET DOCTOR INFO
  // -----------------------------------


  const fetchDoctorInfo = useCallback(async () => {
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
  }, [doctorId]);

  // -----------------------------------
  // FETCH MY PATIENTS
  // -----------------------------------
  const fetchMyPatients = useCallback(async () => {
    try {
      const res = await api.post("/getPatientsForDoctor", { doctorId });

      let data = res.data.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (!Array.isArray(data)) data = [];

      setMyPatients(data);
    } catch {
      toast.error("Unable to load your patients");
    }
  }, [doctorId]);

  // -----------------------------------
  // FETCH ALL PATIENTS
  // -----------------------------------
  const fetchAllPatients = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDoctorInfo();
    fetchMyPatients();
    fetchAllPatients();
    fetchMyEmergencyAccess();
    //checkEmergencyAccess();
  }, [fetchDoctorInfo, fetchMyPatients, fetchAllPatients, fetchMyEmergencyAccess]);

  // Re-fetch emergency access when allPatients is loaded
  useEffect(() => {
    console.log("Emergency patient check - allPatients.length:", allPatients.length);
    console.log("Emergency patient check - emergencyPatientId:", emergencyPatientId);
    console.log("Available patient IDs:", allPatients.map(p => p.patientId));
    
    if (allPatients.length > 0 && emergencyPatientId) {
      // Find the complete patient object from allPatients
      const patient = allPatients.find(p => p.patientId === emergencyPatientId);
      if (patient) {
        setEmergencyPatient(patient);
        console.log("Emergency patient found and set:", patient);
      } else {
        console.error("Patient not found in allPatients list for ID:", emergencyPatientId);
        console.error("Available IDs:", allPatients.map(p => p.patientId));
      }
    }
  }, [allPatients, emergencyPatientId]);

  // -----------------------------------
  // VIEW PATIENT RECORDS (My Patients → Always allowed)
  // -----------------------------------
  const handleViewPatient = async (patient, fromMyPatients = false, isEmergencyAccess = false) => {
    try {
      if (fromMyPatients || isEmergencyAccess) {
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
  const fetchRecords = useCallback(async (patientId) => {
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
  }, [doctorId]);

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


  // // Doctor -> Check if access is approved
  // const checkEmergencyAccess = useCallback(async () => {
  //   if (!patientId) {
  //     console.log("No patientId, skipping check");
  //     return;
  //   }
    
  //   console.log("Checking emergency access for patient:", patientId);
  //   console.log("Request patient:", requestPatient);
  //   console.log("All patients:", allPatients);
  //   console.log("All patients length:", allPatients.length);
    
  //   // Find patient from allPatients if requestPatient is null
  //   const patient = requestPatient || allPatients.find(p => p.patientId === patientId);
  //   console.log("Found patient:", patient);
  //   console.log("Patient search result:", allPatients.find(p => p.patientId === patientId));
    
  //   try {
  //     const res = await api.post("/doctor/emergency/check", {
  //       doctorId,
  //       patientId
  //     });

  //     console.log("API Response:", res.data);

  //     if (res.data.success && res.data.access && res.data.access.access === true) {
  //       console.log("Access approved! Setting emergency patient");
  //       console.log("Patient to set:", patient);
  //       setCanView(true);
  //       setEmergencyPatient(patient); // Use the found patient
  //       console.log("Called setEmergencyPatient with:", patient);
  //       toast.success("Emergency access approved! Check the Emergency Patient tab.");
  //       // Auto-navigate to emergency patient tab after 2 seconds
  //       setTimeout(() => {
  //         console.log("Auto-navigating to emergency patient tab");
  //         setActiveTab("emergency-patient");
  //         if (patient && patient.patientId) {
  //           console.log("Fetching records for patient:", patient.patientId);
  //           fetchRecords(patient.patientId);
  //         } else {
  //           console.log("No patient data available for fetchRecords");
  //         }
  //       }, 2000);
  //     } else {
  //       console.log("Access not approved, continuing poll");
  //       setCanView(false);
  //       // Continue polling every 3 seconds if still pending
  //       setTimeout(() => checkEmergencyAccess(), 3000);
  //     }
  //   } catch (error) {
  //     console.error("Check emergency access error:", error);
  //     setCanView(false);
  //   }
  // }, [patientId, requestPatient, allPatients, doctorId, fetchRecords]);

  // // Auto-check emergency access when emergency-patient tab is opened
  // useEffect(() => {
  //   if (activeTab === "emergency-patient" && patientId && !emergencyPatient) {
  //     console.log("Emergency patient tab opened, but waiting for manual check");
  //     // Don't auto-check, wait for user to click "Check Access Status"
  //   }
  // }, [activeTab, patientId, emergencyPatient, checkEmergencyAccess]);

  useEffect(() => {
  if (emergencyPatientId) {
    console.log("Fetching records for:", emergencyPatientId);
    fetchRecords(emergencyPatientId);
  }
}, [emergencyPatientId, fetchRecords]);

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

        <button
          onClick={() => setActiveTab("emergency-patient")}
          className={`px-6 py-3 ${
            activeTab === "emergency-patient"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Emergency Patient
            {emergencyPatient && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {emergencyPatient.name?.charAt(0) || 'P'}
              </span>
            )}
          </div>
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
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => {
                        setEmergencyPatient(row);
                        setActiveTab("emergency-patient");
                      }}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Emergency
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

      {/* ==================== EMERGENCY PATIENT RECORDS ==================== */}
      {activeTab === "emergency-patient" && (
        <div className="space-y-6">
          {selectedEmergencyPatient ? (
            <>
              {/* Emergency Patient Header */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-800">Emergency Patient Access</h2>
                      <p className="text-sm text-green-700">Temporary access granted for critical care</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedEmergencyPatient(null);
                      setRecords([]);
                    }}
                  >
                    ← Back to Emergency List
                  </Button>
                </div>
              </div>

              {/* Patient Information Card */}
              <ProfessionalCard 
                title="Patient Information" 
                icon={Users}
                badge={{ text: "Emergency Access", type: 'success' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {selectedEmergencyPatient.name?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient Name</p>
                        <p className="font-semibold text-gray-900">{selectedEmergencyPatient.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Patient ID</p>
                    <p className="font-mono font-semibold text-gray-900">{selectedEmergencyPatient.patientId}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="font-semibold text-gray-900">{selectedEmergencyPatient.age} years</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Blood Type</p>
                    <p className="font-semibold text-red-600">{selectedEmergencyPatient.bloodType}</p>
                  </div>
                </div>
              </ProfessionalCard>

              {/* Medical Records */}
              <Card
                title="Medical Records"
                icon={FileText}
                badge={{ text: `${records.length} records`, type: 'info' }}
              >
                {records.length > 0 ? (
                  <Table
                    headers={["Record ID", "Date", "Type", "Diagnosis", "Prescription", "Prescribed By", "Report"]}
                    data={records}
                    renderRow={(record) => (
                      <tr key={record.recordId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{record.recordId}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.reportHash 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {record.reportHash ? 'Digital Report' : 'Text Entry'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {record.diagnosis}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-sm" title={record.prescription}>
                            {record.prescription}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xs">
                                {record.doctorName?.charAt(0) || 'D'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.doctorName || 'Unknown Doctor'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {record.doctorId || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {record.reportHash && (
                            <a
                              href={`https://gateway.pinata.cloud/ipfs/${record.reportHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View Report</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </td>
                      </tr>
                    )}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No medical records found for this patient</p>
                    <p className="text-sm text-gray-500 mt-2">Records may not have been added yet</p>
                  </div>
                )}
              </Card>

              {/* Emergency Actions */}
              <ProfessionalCard 
                title="Emergency Actions" 
                icon={Shield}
                badge={{ text: "Critical Care", type: 'danger' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add Critical Record
                  </Button>
                  <Button variant="secondary" className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Full Medical History
                  </Button>
                  <Button variant="secondary" className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Emergency Contact
                  </Button>
                </div>
              </ProfessionalCard>
            </>
          ) : (
            /* Emergency Patient List */
            <ProfessionalCard 
              title="Emergency Patients" 
              icon={Shield}
              badge={{ text: "Critical Access", type: 'danger' }}
            >
              {emergencyPatient ? (
                <DataTable
                  data={[emergencyPatient]}
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
                      header: "Age",
                      accessor: "age",
                      sortable: true
                    },
                    {
                      header: "Blood Type",
                      accessor: "bloodType",
                      sortable: true
                    },
                    {
                      header: "City",
                      accessor: "city",
                      sortable: true,
                      filterable: true
                    },
                    {
                      header: "Actions",
                      accessor: "actions",
                      render: (_, row) => (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => {
                            setSelectedEmergencyPatient(row);
                            fetchRecords(row.patientId);
                          }}
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
                  pagination={false}
                />
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Patients</h3>
                  <p className="text-gray-600 mb-6">
                    Click the Emergency button in Search All Patients to add emergency access.
                  </p>
                </div>
              )}
            </ProfessionalCard>
          )}
        </div>
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
              headers={["ID", "Date", "Type", "Diagnosis", "Prescription", "Prescribed By", "Report"]}
              data={records}
              renderRow={(r) => (
                <tr key={r.recordId}>
                  <td className="px-6 py-3 font-mono text-sm">{r.recordId}</td>
                  <td className="px-6 py-3">
                    <div className="text-sm">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      r.reportHash 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {r.reportHash ? 'Digital Report' : 'Text Entry'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {r.diagnosis}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="max-w-xs truncate text-sm" title={r.prescription}>
                      {r.prescription}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">
                          {r.doctorName?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {r.doctorName || 'Unknown Doctor'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.doctorId || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {r.reportHash && (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${r.reportHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Report</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
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
