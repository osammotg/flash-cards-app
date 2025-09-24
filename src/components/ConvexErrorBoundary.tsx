'use client';

import React from 'react';

interface ConvexErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ConvexErrorBoundaryProps {
  children: React.ReactNode;
}

export class ConvexErrorBoundary extends React.Component<
  ConvexErrorBoundaryProps,
  ConvexErrorBoundaryState
> {
  constructor(props: ConvexErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ConvexErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ConvexErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
            <p className="text-muted-foreground mb-4">
              There was an issue connecting to the database.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-sm bg-muted p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
