import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, Calendar, MapPin } from 'lucide-react';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = '', 
  helperText = '', 
  icon: Icon, 
  disabled = false, 
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${Icon ? 'pl-10' : 'pl-3'}
            ${type === 'password' ? 'pr-10' : 'pr-3'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          `}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select...', 
  required = false, 
  error = '', 
  helperText = '', 
  disabled = false, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

const TextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = '', 
  helperText = '', 
  rows = 4, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

const Checkbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  required = false, 
  error = '', 
  helperText = '', 
  disabled = false, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
            ${error ? 'border-red-500' : ''}
          `}
        />
        <span className="ml-2 text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

const RadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false, 
  error = '', 
  helperText = '', 
  disabled = false, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export { 
  FormField, 
  SelectField, 
  TextArea, 
  Checkbox, 
  RadioGroup 
};
