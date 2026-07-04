import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Sentry } from '../lib/sentry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, eventId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
    this.setState({ eventId: eventId ?? null });
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-10 max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">Oops!</h1>
            <p className="text-gray-600 mb-4">
              Something went wrong. Please refresh the page or return home.
            </p>
            {this.state.eventId && (
              <p className="text-xs text-gray-400 font-mono mb-6">Event ID: {this.state.eventId}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="btn-primary">
                Refresh page
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="px-6 py-3 border-2 border-[#D4AF37] text-[#7A5C00] rounded-full hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
