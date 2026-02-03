import React from "react";


const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, fullWidth = false, loading = false }) => {
  const baseClasses = "px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed relative";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
};
export default Button;
