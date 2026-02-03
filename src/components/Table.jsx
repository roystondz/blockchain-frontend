const Table = ({ headers, data, renderRow, loading = false, emptyMessage = "No data available" }) => (
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
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx}>
              {headers.map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <div 
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: colIdx === 0 ? "80%" : "60%" }}
                  ></div>
                </td>
              ))}
            </tr>
          ))
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="px-6 py-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>{emptyMessage}</p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((item, idx) => renderRow(item, idx))
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
