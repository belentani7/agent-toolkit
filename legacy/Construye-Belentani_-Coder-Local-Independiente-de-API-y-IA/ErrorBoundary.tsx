import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-card">
            <AlertTriangle
              size={48}
              className="error-boundary-icon"
            />

            <h2>Belentani encontró un error local.</h2>

            <p>La operación se detuvo. Recarga la interfaz para volver a un estado seguro.</p>

            <button
              onClick={() => window.location.reload()}
              className="error-boundary-action"
            >
              <RotateCcw size={16} />
              recargar interfaz
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
