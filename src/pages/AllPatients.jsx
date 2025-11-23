import React, { useEffect, useState } from "react";
import api from "../context/api";
import { toast } from "react-hot-toast";
import { Search, KeyRound } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import Modal from "../components/Modal";

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const doctorId = localStorage.getItem("userId");

  const [doctorInfo, setDoctorInfo] = useState({
    hospitalId: "",
    hospitalName: "",
  });

  useEffect(() => {
    fetchDoctorInfo();
    fetchAllPatients();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      const res = await api.post("/getDoctorInfo", {
        doctorId,
        userId: doctorId,
      });

      if (res.data.success) {
        const d = res.data.data;
        setDoctorInfo({
          hospitalId: d.hospitalId,
          hospitalName: d.hospitalName,
        });
      }
    } catch (err) {
      toast.error("Error loading doctor info");
    }
  };

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/getAllPatients");

      if (res.data.success) setPatients(res.data.data);
    } catch (err) {
      toast.error("Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      await api.post("/doctor/requestAccess", {
        doctorId,
        patientId: selectedPatient.patientId,
        hospitalId: doctorInfo.hospitalId,
        reason: "Need access for consultation",
      });

      toast.success("Access request sent");
      setShowRequestModal(false);
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  const filtered = patients.filter((p) =>
    JSON.stringify(p).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="doctor">
      <Card title="Search All Patients" icon={Search}>
        <input
          type="text"
          placeholder="Search by name, city, or ID..."
          className="border px-4 py-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <Table
            headers={["Patient ID", "Name", "DOB", "City", "Actions"]}
            data={filtered}
            renderRow={(p) => (
              <tr key={p.patientId}>
                <td>{p.patientId}</td>
                <td>{p.name}</td>
                <td>{p.dob}</td>
                <td>{p.city}</td>

                <td className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedPatient(p);
                      setShowRequestModal(true);
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-1" />
                    Request Access
                  </Button>
                </td>
              </tr>
            )}
          />
        )}
      </Card>

      {/* ========== REQUEST ACCESS MODAL ========== */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Access"
      >
        <p className="mb-3">
          Requesting access to <b>{selectedPatient?.name}</b>
        </p>

        <p className="text-sm mb-4">
          Hospital: <b>{doctorInfo.hospitalName}</b>
        </p>

        <Button className="w-full" onClick={handleSendRequest}>
          Send Request
        </Button>
      </Modal>
    </DashboardLayout>
  );
};

export default AllPatients;
