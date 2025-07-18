import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center text-[#F87171] text-xl font-semibold">
          Something went wrong. Please refresh or try again later.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
