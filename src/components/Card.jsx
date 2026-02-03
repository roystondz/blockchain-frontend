import React from 'react';

const Card = ({ title, children, icon: Icon, action, loading = false, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    ) : (
      children
    )}
  </div>
);

export default Card;
