// components/CursorErrorBoundary.js
import { Component } from 'react';

class CursorErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't render cursor if it fails
    }
    return this.props.children;
  }
}

export default CursorErrorBoundary;

