import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

const Toast = ({ type = 'info', message, duration = 5000, action, onClose, persistent = false }) => {
  const toast = document.createElement('div');
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  toast.id = toastId;
  toast.className = `
    fixed top-4 right-4 z-50 transform transition-all duration-300
    ${type === 'success' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    max-w-md w-full
  `;
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  toast.innerHTML = `
    <div class="${typeStyles[type]} p-4 rounded-lg shadow-lg border-l-4">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <Icon class="w-5 h-5 ${iconStyles[type]}" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">${message}</p>
          ${action ? `
            <button onclick="handleAction()" class="mt-2 text-sm underline hover:no-underline">
              ${action.label}
            </button>
          ` : ''}
        </div>
        ${persistent ? '' : `
          <button onclick="this.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        `}
      </div>
    </div>
  `;

  const handleAction = () => {
    if (action && action.onClick) {
      action.onClick();
    }
    if (!persistent) {
      removeToast(toastId);
    }
  };

  const removeToast = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        element.remove();
      }, 300);
    }
  };

  document.body.appendChild(toast);

  if (!persistent && duration > 0) {
    setTimeout(() => {
      removeToast(toastId);
    }, duration);
  }

  return toastId;
};

const showSuccess = (message, options = {}) => {
  return Toast({ type: 'success', message, ...options });
};

const showError = (message, options = {}) => {
  return Toast({ type: 'error', message, ...options });
};

const showWarning = (message, options = {}) => {
  return Toast({ type: 'warning', message, ...options });
};

const showInfo = (message, options = {}) => {
  return Toast({ type: 'info', message, ...options });
};

const ToastContainer = () => {
  return <div id="toast-container" />;
};

export { Toast, showSuccess, showError, showWarning, showInfo, ToastContainer };
