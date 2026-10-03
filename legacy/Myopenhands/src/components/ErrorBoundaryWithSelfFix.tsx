import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Wrench, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { ejecutarProtocoloAutoReparacion } from '../utils/selfFixProtocol';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  repaired: boolean;
  repairLogs: string[];
}

export class ErrorBoundaryWithSelfFix extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      repaired: false,
      repairLogs: [],
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      repaired: false,
      repairLogs: [],
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundaryWithSelfFix] Error no capturado:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleAutoRepair = () => {
    try {
      const resultado = ejecutarProtocoloAutoReparacion();
      this.setState({
        repaired: true,
        repairLogs: resultado.reparacionesRealizadas,
      });

      // Breve espera y recarga suave
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error('Fallo en la auto-reparación:', err);
    }
  };

  private handleDownloadDiagnostic = () => {
    const diagnostic = {
      timestamp: new Date().toISOString(),
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      localStorageKeys: Object.keys(localStorage),
    };
    const blob = new Blob([JSON.stringify(diagnostic, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manos_abiertas_error_diagnostic_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  private handleSafeReset = () => {
    if (window.confirm('¿Deseas reiniciar al estado inicial seguro manteniendo una copia de respaldo?')) {
      this.handleDownloadDiagnostic();
      localStorage.removeItem('ma_progress');
      localStorage.removeItem('ma_cv');
      localStorage.removeItem('ma_apts');
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Protocolo de Auto-Recuperación Activado
                </h1>
                <p className="text-xs text-slate-400">
                  Manos Abiertas ha protegido tus datos locales de forma segura.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 my-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-40">
              <span className="text-red-400 font-bold">Causa detectada: </span>
              {this.state.error?.message || 'Error de renderizado inesperado'}
            </div>

            {this.state.repaired ? (
              <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-4 mb-4 text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Auto-reparación completada con éxito. Reiniciando aplicación...
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2">
                  {this.state.repairLogs.map((log, idx) => (
                    <li key={idx}>{log}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={this.handleAutoRepair}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Wrench className="w-4 h-4" />
                Ejecutar Auto-Reparación (1-Clic)
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar Aplicación
              </button>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
              <button
                onClick={this.handleDownloadDiagnostic}
                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar informe de error
              </button>
              <button
                onClick={this.handleSafeReset}
                className="hover:text-red-400 transition-colors"
              >
                Restablecer datos seguros
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
