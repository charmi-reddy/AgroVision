import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="w-16 h-16" style={{ color: 'var(--danger, #ef4444)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Something went wrong
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                We encountered an unexpected error. This has been logged and we'll look into it.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-4 p-3 rounded-lg text-xs"
                  style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border)' }}>
                  <summary className="cursor-pointer font-medium" style={{ color: 'var(--text-primary)' }}>
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap" style={{ color: 'var(--text-tertiary)' }}>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}