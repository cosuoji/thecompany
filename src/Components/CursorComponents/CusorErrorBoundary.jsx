// components/CursorErrorBoundary.js
import { Component } from 'react';

class CursorErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

 render() {
  if (this.state.hasError) {
    return (
      <span className="fixed top-0 left-0 p-2 bg-red-500 text-white text-xs z-50">
        Cursor crashed
      </span>
    );
  }
  return this.props.children;
}
}

export default CursorErrorBoundary;

