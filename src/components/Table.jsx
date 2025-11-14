const Table = ({ headers, data, renderRow }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
              No data available
            </td>
          </tr>
        
        ) : (
          data.map((item, idx) => renderRow(item, idx))
        )}
      </tbody>
    </table>
      <div>
          
          </div>
  </div>
);
export default Table;
