import React from 'react';
import Button from './Button';

const Navbar = ({ user, onLogout }) => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xl font-bold text-gray-800">MediChain</span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.userId} <span className="text-blue-600 font-medium">({user.role})</span>
            </span>
            <Button onClick={onLogout} variant="secondary" className="text-sm">
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;