import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Download, Share2, Printer, Eye } from 'lucide-react';

const AdvancedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closable = true,
  showHeader = true,
  showFooter = false,
  footerActions = [],
  className = ""
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closable ? onClose : undefined}
        />

        {/* Modal */}
        <div 
          className={`
            relative w-full transform rounded-lg bg-white shadow-xl transition-all
            ${sizeClasses[size]} ${isMaximized ? 'w-full h-full max-w-none' : ''}
            ${className}
          `}
        >
          {/* Header */}
          {showHeader && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <div className="flex items-center gap-2">
                {size !== 'full' && (
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isMaximized ? 'Minimize' : 'Maximize'}
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                )}
                {closable && (
                  <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              {footerActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }
                    ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedModal;
