import React, { Component, ErrorInfo, ReactNode } from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8 space-y-4 animate-in fade-in">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <CircleAlert size={32} />
          </div>
          <h3 className="text-2xl font-bold text-red-800">
            Oops, noko gjekk gale!
          </h3>
          <p className="text-red-700">
            Det oppsto ein uventa feil i {this.props.componentName ? `"${this.props.componentName}"` : 'denne delen av programmet'}.
          </p>
          <div className="w-full text-left bg-white p-4 rounded-xl border border-red-100 overflow-auto max-h-40 text-xs text-slate-700 font-mono shadow-inner mt-4">
            {this.state.error?.toString()}
          </div>
          <p className="text-sm text-red-600 mt-4">
            Du kan prøve å laste inn komponenten på nytt, eller gå tilbake.
          </p>
          <button 
            onClick={this.handleReset}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
          >
            <RefreshCw size={18} /> Prøv på nytt
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
