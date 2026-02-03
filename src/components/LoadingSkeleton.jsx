import React from "react";

const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: idx === lines - 1 ? "60%" : "100%",
            animationDelay: `${idx * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    <LoadingSkeleton lines={2} />
  </div>
);

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, idx) => (
            <th key={idx} className="px-6 py-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx} className="px-6 py-4">
                <div 
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: colIdx === 0 ? "80%" : "60%" }}
                ></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export { LoadingSkeleton, CardSkeleton, TableSkeleton };
