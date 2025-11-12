import React from 'react';

const Table = ({ headers, data, renderRow }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y">
        {data.map((item, index) => renderRow(item, index))}
      </tbody>
    </table>
  </div>
);

export default Table;