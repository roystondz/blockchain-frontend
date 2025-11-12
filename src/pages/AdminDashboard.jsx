const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [hospitalForm, setHospitalForm] = useState({
    adminId: user?.userId || '',
    hospitalId: '',
    name: '',
    city: '',
  });

  const [doctorForm, setDoctorForm] = useState({
    hospitalId: '',
    doctorId: '',
    hospitalName: '',
    name: '',
    department: '',
    city: '',
  });

  const [patientForm, setPatientForm] = useState({
    hospitalId: '',
    patientId: '',
    hospitalName: '',
    name: '',
    dob: '',
    city: '',
  });

  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/registerHospital', hospitalForm);
      toast.success('Hospital registered successfully!');
      setHospitalForm({ adminId: user?.userId || '', hospitalId: '', name: '', city: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to register hospital');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/registerDoctor', doctorForm);
      toast.success('Doctor registered successfully!');
      setDoctorForm({ hospitalId: '', doctorId: '', hospitalName: '', name: '', department: '', city: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to register doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/registerPatient', patientForm);
      toast.success('Patient registered successfully!');
      setPatientForm({ hospitalId: '', patientId: '', hospitalName: '', name: '', dob: '', city: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hospital', label: 'Register Hospital' },
    { id: 'doctor', label: 'Register Doctor' },
    { id: 'patient', label: 'Register Patient' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hospital Administration</h1>
      
      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'hospital' && (
          <form onSubmit={handleRegisterHospital}>
            <Input
              label="Admin ID"
              value={hospitalForm.adminId}
              onChange={(e) => setHospitalForm({ ...hospitalForm, adminId: e.target.value })}
              required
            />
            <Input
              label="Hospital ID"
              value={hospitalForm.hospitalId}
              onChange={(e) => setHospitalForm({ ...hospitalForm, hospitalId: e.target.value })}
              placeholder="e.g., HOSP001"
              required
            />
            <Input
              label="Hospital Name"
              value={hospitalForm.name}
              onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
              required
            />
            <Input
              label="City"
              value={hospitalForm.city}
              onChange={(e) => setHospitalForm({ ...hospitalForm, city: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Hospital'}
            </Button>
          </form>
        )}

        {activeTab === 'doctor' && (
          <form onSubmit={handleRegisterDoctor}>
            <Input
              label="Hospital ID"
              value={doctorForm.hospitalId}
              onChange={(e) => setDoctorForm({ ...doctorForm, hospitalId: e.target.value })}
              required
            />
            <Input
              label="Hospital Name"
              value={doctorForm.hospitalName}
              onChange={(e) => setDoctorForm({ ...doctorForm, hospitalName: e.target.value })}
              required
            />
            <Input
              label="Doctor ID"
              value={doctorForm.doctorId}
              onChange={(e) => setDoctorForm({ ...doctorForm, doctorId: e.target.value })}
              placeholder="e.g., DOC001"
              required
            />
            <Input
              label="Doctor Name"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
              required
            />
            <Input
              label="Department"
              value={doctorForm.department}
              onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
              placeholder="e.g., Cardiology"
              required
            />
            <Input
              label="City"
              value={doctorForm.city}
              onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Doctor'}
            </Button>
          </form>
        )}

        {activeTab === 'patient' && (
          <form onSubmit={handleRegisterPatient}>
            <Input
              label="Hospital ID"
              value={patientForm.hospitalId}
              onChange={(e) => setPatientForm({ ...patientForm, hospitalId: e.target.value })}
              required
            />
            <Input
              label="Hospital Name"
              value={patientForm.hospitalName}
              onChange={(e) => setPatientForm({ ...patientForm, hospitalName: e.target.value })}
              required
            />
            <Input
              label="Patient ID"
              value={patientForm.patientId}
              onChange={(e) => setPatientForm({ ...patientForm, patientId: e.target.value })}
              placeholder="e.g., PAT001"
              required
            />
            <Input
              label="Patient Name"
              value={patientForm.name}
              onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={patientForm.dob}
              onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
              required
            />
            <Input
              label="City"
              value={patientForm.city}
              onChange={(e) => setPatientForm({ ...patientForm, city: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Patient'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard