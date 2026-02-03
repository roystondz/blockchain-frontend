import React from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle, Activity, Users, FileText, Database } from 'lucide-react';

const ProfessionalCard = ({ 
  title, 
  subtitle, 
  children, 
  icon: Icon, 
  status = 'default',
  loading = false,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  action = null,
  badge = null,
  gradient = false
}) => {
  const statusConfig = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-white to-gray-50' 
    : 'bg-white';

  return (
    <div className={`
      rounded-xl border shadow-sm hover:shadow-md transition-all duration-200
      ${statusConfig[status]} ${gradientClasses} ${className}
    `}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 pb-4 ${headerClassName}`}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`
              p-2 rounded-lg
              ${status === 'success' ? 'bg-green-100 text-green-600' :
                status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                status === 'error' ? 'bg-red-100 text-red-600' :
                status === 'info' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }
            `}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`
              px-2 py-1 text-xs rounded-full font-medium
              ${badge.type === 'success' ? 'bg-green-100 text-green-800' :
                badge.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                badge.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }
            `}>
              {badge.text}
            </span>
          )}
          {action}
        </div>
      </div>

      {/* Body */}
      <div className={`px-6 pb-6 ${bodyClassName}`}>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  loading = false,
  className = ""
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  };

  return (
    <ProfessionalCard
      title={title}
      icon={Icon}
      className={className}
      loading={loading}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </div>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </div>
          )}
        </div>
        {Icon && !loading && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>
    </ProfessionalCard>
  );
};

const BlockchainCard = ({ 
  title, 
  description, 
  status = 'active',
  metrics = {},
  className = ""
}) => {
  return (
    <ProfessionalCard
      title={title}
      subtitle={description}
      icon={Shield}
      status={status === 'active' ? 'success' : 'warning'}
      badge={{ text: status, type: status === 'active' ? 'success' : 'warning' }}
      className={className}
      gradient
    >
      <div className="space-y-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Activity className="w-3 h-3" />
            <span>Secured by Hyperledger Fabric</span>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
};

const ActivityCard = ({ 
  title, 
  activities = [], 
  loading = false,
  maxItems = 5,
  className = ""
}) => {
  return (
    <ProfessionalCard
      title={title}
      icon={Clock}
      className={className}
      loading={loading}
    >
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mt-1"></div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          activities.slice(0, maxItems).map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${activity.type === 'success' ? 'bg-green-100 text-green-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }
              `}>
                {activity.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {activity.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                {activity.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                {activity.type === 'info' && <Activity className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </ProfessionalCard>
  );
};

export { ProfessionalCard, StatsCard, BlockchainCard, ActivityCard };
