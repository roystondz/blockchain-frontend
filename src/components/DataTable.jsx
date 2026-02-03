import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Calendar, Clock, FileText, User, Filter, Download, Eye } from 'lucide-react';

const DataTable = ({ 
  data, 
  columns, 
  loading = false, 
  pagination = true,
  searchable = true,
  filterable = true,
  exportable = true,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef(null);

  const itemsPerPage = 10;

  // Filter and search data
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = item[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const exportData = () => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...filteredData.map(row => 
        columns.map(col => {
          const value = row[col.accessor];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderCell = (column, row) => {
    const value = row[column.accessor];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === 'status') {
      const statusConfig = {
        active: { color: 'green', label: 'Active' },
        inactive: { color: 'red', label: 'Inactive' },
        pending: { color: 'yellow', label: 'Pending' }
      };
      const config = statusConfig[value] || statusConfig.active;
      return (
        <span className={`px-2 py-1 text-xs rounded-full bg-${config.color}-100 text-${config.color}-800`}>
          {config.label}
        </span>
      );
    }

    return value;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
          
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedRows.size} selected
              </span>
            )}
            
            {exportable && (
              <button
                onClick={exportData}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {(searchable || filterable) && (
          <div className="mt-4 space-y-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {filterable && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {Object.values(filters).some(v => v) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              </div>
            )}

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                {columns.filter(col => col.filterable).map(column => (
                  <div key={column.accessor}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {column.header}
                    </label>
                    <input
                      type="text"
                      value={filters[column.accessor] || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        [column.accessor]: e.target.value
                      }))}
                      placeholder={`Filter by ${column.header.toLowerCase()}`}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" ref={tableRef}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map(column => (
                <th
                  key={column.accessor}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortColumn === column.accessor 
                          ? (sortDirection === 'asc' ? '↑' : '↓')
                          : '↕'
                        }
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {columns.map(column => (
                    <td key={column.accessor} className="px-4 py-3 text-sm text-gray-900">
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
