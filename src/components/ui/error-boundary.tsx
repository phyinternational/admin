import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: any;
  errorInfo?: any;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    // Define a state variable to track whether there is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.error('Captured error in ErrorBoundary:', error);
    console.error(errorInfo?.componentStack || errorInfo);
    // store details in state so UI can show them
    this.setState({ error, errorInfo });
  }

  render() {
    // Check if an error is thrown
    if (this.state.hasError) {
      // Render a more helpful fallback UI that shows the error and allows retry
      return (
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <div className="mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-3 rounded">
              {String(this.state.error?.message || this.state.error) || 'Error'}
            </pre>
          </div>
          <details className="mb-4">
            <summary className="cursor-pointer text-sm">Details</summary>
            <pre className="whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 p-3 rounded mt-2">
              {this.state.errorInfo?.componentStack || JSON.stringify(this.state.errorInfo || {}, null, 2)}
            </pre>
          </details>
          <div>
            <button
              className="px-3 py-1 bg-[#2563eb] text-white rounded"
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
