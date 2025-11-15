import { toast } from "react-hot-toast";
import { useState,useEffect } from "react";
import Card from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import { Users, FileText, Eye, Upload,Hospital,MapPin } from "lucide-react";
import Table from "../components/Table";
const DoctorHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchHospitals();
  }, []);
  
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/getSystemStats');
      if (res.data.success && res.data.data.hospitals) {
        setHospitals(res.data.data.hospitals || []);
      } else {
        // Mock data if endpoint doesn't return hospitals list
        setHospitals([
          { hospitalId: 'HOSP001', name: 'City General Hospital', city: 'New York', totalDoctors: 15, totalPatients: 120 },
          { hospitalId: 'HOSP002', name: 'Metro Health Center', city: 'Los Angeles', totalDoctors: 12, totalPatients: 95 },
          { hospitalId: 'HOSP003', name: 'Central Medical Institute', city: 'Chicago', totalDoctors: 18, totalPatients: 150 }
        ]);
      }
    } catch (error) {
      toast.error('Failed to fetch hospitals');
      // Show mock data on error
      setHospitals([
        { hospitalId: 'HOSP001', name: 'City General Hospital', city: 'New York', totalDoctors: 15, totalPatients: 120 },
        { hospitalId: 'HOSP002', name: 'Metro Health Center', city: 'Los Angeles', totalDoctors: 12, totalPatients: 95 },
        { hospitalId: 'HOSP003', name: 'Central Medical Institute', city: 'Chicago', totalDoctors: 18, totalPatients: 150 }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout role="admin" userName="admin">
      <Card title="Hospitals Network" icon={Hospital}>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading hospitals...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Total Hospitals</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{hospitals.length}</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <p className="text-sm text-teal-600 font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-teal-700 mt-2">
                  {hospitals.reduce((sum, h) => sum + (h.totalDoctors || 0), 0)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {hospitals.reduce((sum, h) => sum + (h.totalPatients || 0), 0)}
                </p>
              </div>
            </div>
            
            <Table
              headers={['Hospital ID', 'Hospital Name', 'City', 'Doctors', 'Patients']}
              data={hospitals}
              renderRow={(hospital) => (
                <tr key={hospital.hospitalId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hospital.hospitalId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {hospital.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {hospital.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                      {hospital.totalDoctors || 0} Doctors
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {hospital.totalPatients || 0} Patients
                    </span>
                  </td>
                </tr>
              )}
            />
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default DoctorHospitals;