import React from 'react';
import { Search, Filter, Calendar, Download, Upload, RefreshCw, Settings, Bell, User, LogOut, Menu, X } from 'lucide-react';

const ProfessionalToolbar = ({ 
  title, 
  subtitle, 
  actions = [], 
  filters = null,
  search = null,
  loading = false,
  className = ""
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled || loading}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${action.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50' 
                  : action.variant === 'secondary'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                }
              `}
            >
              {action.loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : action.icon ? (
                <action.icon className="w-4 h-4" />
              ) : null}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      {(search || filters) && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {search && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder || "Search..."}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {filters && (
            <div className="flex items-center gap-2">
              {filters.map((filter, index) => (
                <select
                  key={index}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{filter.placeholder}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProfessionalHeader = ({ 
  user, 
  notifications = 0,
  onMenuClick,
  onLogout,
  onNotificationsClick,
  showUserMenu = true,
  className = ""
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          {onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
          )}

          {/* User Menu */}
          {showUserMenu && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </button>

              {/* Dropdown */}
              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      {onLogout && (
                        <button 
                          onClick={onLogout}
                          className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const ProfessionalSidebar = ({ 
  items, 
  activeItem, 
  onItemClick, 
  isOpen, 
  onClose,
  user = null,
  className = ""
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 transform z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-200 ease-in-out
        w-64 bg-white border-r border-gray-200 flex flex-col
        ${className}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">EHR System</h2>
              <p className="text-sm text-gray-500">Healthcare Platform</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {user && (
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeItem === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-900">System Status</span>
            </div>
            <p className="text-xs text-blue-700">All systems operational</p>
          </div>
        </div>
      </div>
    </>
  );
};

export { ProfessionalToolbar, ProfessionalHeader, ProfessionalSidebar };
