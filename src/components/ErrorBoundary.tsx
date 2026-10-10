import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface State {
  hasError: boolean;
}

/** Shows a fallback instead of a blank screen if a child component crashes. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log only the error type. Never log user input.
    console.error('A component failed to render:', error.name);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
