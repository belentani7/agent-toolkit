import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Download,
  RotateCcw,
  Volume2,
  Database,
  Languages,
  Layers,
  Wifi,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ejecutarAuditoriaCompleta,
  ejecutarProtocoloAutoReparacion,
  SystemAuditReport,
} from '../utils/selfFixProtocol';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRepaired?: () => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({
  isOpen,
  onClose,
  onDataRepaired,
}) => {
  const [reporte, setReporte] = useState<SystemAuditReport | null>(null);
  const [isRunningFix, setIsRunningFix] = useState(false);
  const [repairLogs, setRepairLogs] = useState<string[]>([]);
  const [fixSuccess, setFixSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      const rep = ejecutarAuditoriaCompleta();
      setReporte(rep);
      setRepairLogs([]);
      setFixSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen || !reporte) return null;

  const handleRunSelfFix = () => {
    setIsRunningFix(true);
    setTimeout(() => {
      const res = ejecutarProtocoloAutoReparacion();
      setRepairLogs(res.reparacionesRealizadas);
      setFixSuccess(res.exito);
      setReporte(res.nuevoReporte);
      setIsRunningFix(false);
      if (onDataRepaired) {
        onDataRepaired();
      }
    }, 600);
  };

  const handleDownloadDiagnostic = () => {
    const data = {
      tipo: 'MANOS_ABIERTAS_DIAGNOSTICO_SISTEMA',
      fecha: new Date().toISOString(),
      reporte,
      repairLogs,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconocido',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_manos_abiertas_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIconForCategory = (mod: string) => {
    if (mod.includes('Almacenamiento')) return <Database className="w-4 h-4 text-emerald-500" />;
    if (mod.includes('Voz') || mod.includes('Audio')) return <Volume2 className="w-4 h-4 text-sky-500" />;
    if (mod.includes('i18n') || mod.includes('Internacionalización') || mod.includes('Idiomas'))
      return <Languages className="w-4 h-4 text-purple-500" />;
    if (mod.includes('Nodos') || mod.includes('Ecosistema')) return <Layers className="w-4 h-4 text-amber-500" />;
    return <Wifi className="w-4 h-4 text-teal-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 font-heading">
                  Auditoría, Funcionalidad & Protocolo Self-Fix
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  En Vivo
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verificación de integridad, resilencia de datos y autorreparación automática
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          {/* Score card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center justify-center p-2 text-center border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {reporte.puntuacionSalud}%
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Salud Global
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">
                {reporte.verificacionesAprobadas} / {reporte.totalVerificaciones}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Aprobadas
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-2xl font-extrabold text-amber-500">
                {reporte.advertencias}
              </span>
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wide">
                Advertencias
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-2xl font-extrabold text-red-500">
                {reporte.criticos}
              </span>
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">
                Críticos
              </span>
            </div>
          </div>

          {/* Self fix execution banner if any */}
          {fixSuccess !== null && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                fixSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {fixSuccess ? 'Protocolo de Auto-Reparación ejecutado con éxito' : 'Auto-reparación parcial'}
              </div>
              <ul className="list-disc list-inside space-y-1">
                {repairLogs.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Verification list */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Desglose de Verificaciones del Sistema
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {reporte.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getIconForCategory(item.modulo)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {item.nombre}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          [{item.modulo}]
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{item.mensaje}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {item.estado === 'ok' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> OK
                      </span>
                    )}
                    {item.estado === 'advertencia' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Revisar
                      </span>
                    )}
                    {item.estado === 'critico' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Crítico
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReporte(ejecutarAuditoriaCompleta())}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-auditar
            </button>
            <button
              onClick={handleDownloadDiagnostic}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Informe JSON
            </button>
          </div>

          <button
            onClick={handleRunSelfFix}
            disabled={isRunningFix}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Wrench className="w-4 h-4" />
            {isRunningFix ? 'Reparando y Sincronizando...' : 'Ejecutar Auto-Reparación (Self-Fix)'}
          </button>
        </div>
      </div>
    </div>
  );
};
