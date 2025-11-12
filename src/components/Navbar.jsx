import React from "react";
import { Menu, Activity } from "lucide-react";


const Navbar = ({ userName, onMenuClick }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <button onClick={onMenuClick} className="lg:hidden text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex-1 lg:ml-0 ml-4">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {userName}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Activity className="w-5 h-5 text-green-500" />
        <span className="text-sm text-gray-600">System Active</span>
      </div>
    </div>
  </header>
);

export default Navbar;