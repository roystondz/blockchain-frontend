import React from 'react';

const Card = ({ title, children, icon: Icon, action }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

export default Card;
