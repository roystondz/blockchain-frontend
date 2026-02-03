import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', {
      errorId: this.state.errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // You could also send this to a logging service
    // logErrorToService(error, errorInfo, this.state.errorId);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. This has been logged and our team will investigate.
              </p>

              {/* Error ID for support */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-600">
                  Error ID: <span className="font-mono font-medium">{this.state.errorId}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={this.handleReset}
                  className="w-full"
                  loading={false}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Login
                </Button>
              </div>

              {/* Additional Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  If the problem persists, you can:
                </p>
                <div className="space-y-2 text-sm">
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-blue-600 hover:text-blue-800 block w-full text-left"
                  >
                    • Refresh the page
                  </button>
                  <button 
                    onClick={() => {
                      // Clear localStorage and reload
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="text-blue-600 hover:text-blue-800 block w-full text-left"
                  >
                    • Clear cache and refresh
                  </button>
                  <button 
                    onClick={() => {
                      // Copy error details to clipboard
                      const errorDetails = `Error ID: ${this.state.errorId}\nError: ${this.state.error?.toString()}\nTimestamp: ${new Date().toISOString()}`;
                      navigator.clipboard.writeText(errorDetails);
                      alert('Error details copied to clipboard');
                    }}
                    className="text-blue-600 hover:text-blue-800 block w-full text-left"
                  >
                    • Copy error details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    console.error('Async error captured:', error);
    setError(error);
  }, []);

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

export default ErrorBoundary;
