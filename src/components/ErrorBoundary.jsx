import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[GlowMouth] Uncaught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="not-found">
          <div className="not-found-num">!</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'var(--text)', marginBottom: 12 }}>
            Something went wrong.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 420 }}>
            An unexpected error interrupted this page. Try returning home — your scan data is safe.
          </p>
          <button type="button" className="btn btn-primary" onClick={this.handleReset}>Back to Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}
