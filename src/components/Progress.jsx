import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ProgressStepper = ({ steps, currentStep, completed = false }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || completed;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 border-2
                    ${isCompleted 
                      ? 'bg-green-500 text-white border-green-500' 
                      : isActive 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                      : 'bg-gray-200 text-gray-500 border-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {!isLast && (
                <div className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max = 100, label, color = 'blue', showPercentage = true, size = 'md' }) => {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const CircularProgress = ({ value, max = 100, size = 120, strokeWidth = 8, color = 'blue', label }) => {
  const percentage = Math.round((value / max) * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500'
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClasses[color]} transition-all duration-500 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

const LoadingSpinner = ({ size = 'md', text, overlay = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-500`} />
      {text && (
        <span className="mt-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

const StatusIndicator = ({ status, size = 'sm', animated = false }) => {
  const statusConfig = {
    online: { color: 'bg-green-500', pulse: true },
    offline: { color: 'bg-gray-400', pulse: false },
    busy: { color: 'bg-yellow-500', pulse: true },
    error: { color: 'bg-red-500', pulse: true },
    success: { color: 'bg-green-500', pulse: false }
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full ${config.color}
        ${animated && config.pulse ? 'animate-pulse' : ''}
      `}
    />
  );
};

export { ProgressStepper, ProgressBar, CircularProgress, LoadingSpinner, StatusIndicator };
