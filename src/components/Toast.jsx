import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose, duration = 5000, action }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getStyles = () => {
    const base = 'flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-[320px] max-w-md';
    const iconColors = {
      success: 'bg-green-100 text-green-600 border-green-500',
      error: 'bg-red-100 text-red-600 border-red-500',
      warning: 'bg-yellow-100 text-yellow-600 border-yellow-500',
      info: 'bg-blue-100 text-blue-600 border-blue-500'
    };
    
    return `${base} ${iconColors[type]}`;
  };

  const Icon = getIcon();

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 transform transition-all duration-300
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={getStyles()}>
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-1 text-sm underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((config) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...config };
    
    setToasts(prev => [...prev, newToast]);
    
    if (config.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, config.duration || 5000);
    }
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  React.useEffect(() => {
    // Global toast function
    window.showToast = addToast;
    
    return () => {
      delete window.showToast;
    };
  }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
