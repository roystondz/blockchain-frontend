import React, { useState } from "react";
import { Search, Filter, Calendar, User, MapPin, X } from "lucide-react";
import Button from "./Button";
import InputField from "./InputField";

const AdvancedSearch = ({ onSearch, onFilter, loading = false }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    department: "",
    status: "",
    location: "",
    doctorId: ""
  });

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleFilter = () => {
    onFilter?.(filters);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      department: "",
      status: "",
      location: "",
      doctorId: ""
    });
    onFilter?.({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'string' ? value : (value.start || value.end)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search patients, doctors, records..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button onClick={handleSearch} loading={loading}>
          Search
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Departments</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City or Hospital"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Doctor ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Doctor ID
              </label>
              <input
                type="text"
                value={filters.doctorId}
                onChange={(e) => setFilters(prev => ({ ...prev, doctorId: e.target.value }))}
                placeholder="DOC-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleFilter}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {filters.dateRange.start && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              From: {filters.dateRange.start}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: "" }
                }))}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.dateRange.end && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              To: {filters.dateRange.end}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: "" }
                }))}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.department && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {filters.department}
              <button
                onClick={() => setFilters(prev => ({ ...prev, department: "" }))}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {filters.status}
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: "" }))}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
