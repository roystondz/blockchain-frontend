import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../context/api";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";

const PatientAccessRequests = () => {
  const patientId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.post("/patient/getAccessRequests", { patientId });
      if (res.data.success) {
        // ensure array
        const data = Array.isArray(res.data.data) ? res.data.data : JSON.parse(res.data.data || "[]");
        setRequests(data);
      }
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await api.post("/patient/updateAccessRequest", { patientId, requestId, action });
      toast.success(`${action}ED`);
      loadRequests();
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  return (
    <DashboardLayout role="patient">
      <Card title="Access Requests">
        {loading ? (
          <p className="py-6 text-center">Loading...</p>
        ) : requests.length === 0 ? (
          <p>No access requests</p>
        ) : (
          <Table
            headers={["Request ID", "Doctor ID", "Hospital", "Reason", "Status", "Actions"]}
            data={requests}
            renderRow={(r) => (
              <tr key={r.requestId}>
                <td className="px-6 py-3">{r.requestId}</td>
                <td className="px-6 py-3">{r.doctorId}</td>
                <td className="px-6 py-3">{r.hospitalId || "—"}</td>
                <td className="px-6 py-3">{r.reason}</td>
                <td className="px-6 py-3">{r.status}</td>
                <td className="px-6 py-3 flex gap-2">
                  {r.status === "PENDING" && (
                    <>
                      <Button onClick={() => handleAction(r.requestId, "APPROVE")}>Approve</Button>
                      <Button variant="secondary" onClick={() => handleAction(r.requestId, "REJECT")}>Reject</Button>
                    </>
                  )}
                </td>
              </tr>
            )}
          />
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PatientAccessRequests;
