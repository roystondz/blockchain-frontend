import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Hospital, Users, FileText, Settings, LogOut, Upload, UserPlus, Activity, Shield, Database, ShowerHead } from "lucide-react";
import { toast } from "react-hot-toast";


const Sidebar = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = {
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin' },
       {icon: Hospital,label:"Show Hospitals",path:'/showhos'},
      { icon: Database, label: 'Ledger Stats', path: '/ledger' }
    ],
    hospital: [
      { icon: Home, label: 'Dashboard', path: '/hospital' }
    ],
    doctor: [
      { icon: Home, label: 'Dashboard', path: '/doctor' },
      
    ],
    patient: [
      { icon: Home, label: 'Dashboard', path: '/patient' },
    
    ]
  };
  
  const items = menuItems[role] || [];
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 w-64 bg-white border-r border-gray-200 z-50 flex flex-col`}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">EHR System</h1>
          <p className="text-sm text-gray-500 capitalize mt-1">{role} Portal</p>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};


export default Sidebar