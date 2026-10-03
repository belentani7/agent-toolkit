import React, { Component } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { omniAutonomy } from '../services/omniAutonomy';

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message: string }

export class OmniErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare setState: (nextState: State) => void;
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Error inesperado de interfaz.' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    omniAutonomy.enqueue('health_check', { source: 'ui-error-boundary', message: error.message, componentStack: info.componentStack ?? '' }, 5);
  }

  recover = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen bg-[#0c0c0e] text-zinc-200 flex items-center justify-center p-6">
        <section className="glass neon-border max-w-lg rounded-3xl p-8 text-center space-y-5">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" aria-hidden="true" />
          <h1 className="text-2xl font-black text-white">BELENTANI sigue protegido</h1>
          <p className="text-zinc-400">Un módulo visual falló. El runtime aisló el error para evitar acciones incompletas.</p>
          <p className="text-xs text-zinc-600 font-mono break-words">{this.state.message}</p>
          <button onClick={this.recover} className="btn-neon text-black inline-flex items-center gap-2"><RefreshCw className="w-4 h-4" aria-hidden="true" /> Reintentar interfaz</button>
        </section>
      </main>
    );
  }
}

export default OmniErrorBoundary;
