import React, { useState } from 'react';
import { Language } from '../types';
import { FINANCIAL_GUIDES, BankGuideItem } from '../data/financeHousingData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Landmark,
  ShieldCheck,
  Calculator,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface NodeFinanceProps {
  language: Language;
}

export const NodeFinance: React.FC<NodeFinanceProps> = () => {
  const [selectedGuide, setSelectedGuide] = useState<BankGuideItem>(FINANCIAL_GUIDES[0]);
  const [remittanceAmount, setRemittanceAmount] = useState<number>(200);

  // Remittance fee comparison
  const bankWireFee = 25 + remittanceAmount * 0.035; // Standard high street bank
  const fintechFee = 1.5 + remittanceAmount * 0.008; // Regulated low-fee remittance
  const savings = bankWireFee - fintechFee;

  const handleDownloadComplaintLetter = () => {
    const text = `A LA ATENCIÓN DEL SERVICIO DE ATENCIÓN AL CLIENTE / DEFENSOR DEL CLIENTE DE LA ENTIDAD BANCARIA:

Por medio de la presente, yo, [NOMBRE Y APELLIDOS], con documento de identidad / Pasaporte nº [NÚMERO DE PASAPORTE], pongo en su conocimiento la DENUNCIA / RECLAMACIÓN FORMAL por la negativa indebida de apertura de una CUENTA DE PAGO BÁSICA en su sucursal de [DIRECCIÓN / CIUDAD].

FUNDAMENTOS DE DERECHO:
1. El Real Decreto-ley 19/2017, de 24 de noviembre, de cuentas de pago básicas, transposición de la Directiva 2014/92/UE del Parlamento Europeo y del Consejo.
2. La Orden ECE/228/2019, de 28 de febrero, por la que se establece el régimen de gratuidad de las cuentas de pago básicas para personas en situación de vulnerabilidad económica o riesgo de exclusión financiera.
3. El artículo 3 del citado RD-ley 19/2017 establece explícitamente que tienen derecho al acceso a una cuenta de pago básica todas las personas que residan legalmente en la Unión Europea, incluidos los solicitantes de asilo y aquellas personas que no tengan permiso de residencia pero cuya expulsión sea imposible por razones jurídicas o de hecho. La mera tenencia de Pasaporte es documento válido para la identificación y prevención de blanqueo de capitales (Ley 10/2010).

SOLICITO:
La apertura inmediata de la Cuenta de Pago Básica solicitada, o en su defecto, la entrega motivada por escrito de la denegación en un plazo máximo de diez días hábiles, advirtiendo que de no recibir respuesta elevaré esta reclamación ante el Departamento de Conducta de Entidades del BANCO DE ESPAÑA.

En [CIUDAD], a [FECHA].

Firma: ________________________
Nombre:
Teléfono:
Correo:`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Modelo_Reclamacion_Cuenta_Pago_Basica_Banco_Espana.txt';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 10 · Economía Popular & Bancaria
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Cuentas de Pago Básicas · Microcréditos · Remesas Justas · RETA Autónomos
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Inclusión Financiera & Banca Ética
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Conoce tus derechos bancarios garantizados por ley: ninguna entidad puede negarte una cuenta de pago básica por carecer de NIE o estar en situación irregular. Accede a microcréditos sociales y reduce las comisiones en el envío de dinero a tus familias.
            </p>
          </div>

          <button
            onClick={handleDownloadComplaintLetter}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all self-start sm:self-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Modelo Reclamación Banco de España</span>
          </button>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FINANCIAL_GUIDES.map((guide) => {
          const isSelected = selectedGuide.id === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'glass-card hover:border-orange-400/80 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase opacity-80">
                <span>{guide.category}</span>
                <span>Guía Oficial</span>
              </div>
              <h3 className="text-xs font-bold leading-snug">{guide.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Selected Guide Details & Remittance Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detailed Guide */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="space-y-2 border-b border-white/40 dark:border-white/10 pb-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40 uppercase">
                Categoría: {selectedGuide.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedGuide.title}
              </h2>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Explicación y Alcance
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedGuide.summary}
              </p>
            </div>

            {/* Legal Rights */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Derechos Garantizados por Ley
              </h3>
              <div className="space-y-2">
                {selectedGuide.legalRights.map((right, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pasos Prácticos Recomendados
              </h3>
              <div className="space-y-2">
                {selectedGuide.actionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle bg-orange-500/10 border border-orange-300/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended entities */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Entidades Colaboradoras & Bancarias Verificadas:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedGuide.recommendedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg glass-pill text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Remittance Fee Simulator & Legal Warnings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Remittance Calculator */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Comparador de Remesas & Comisiones
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calcula cuánto ahorras al enviar dinero a tu país de origen evitando las comisiones ocultas de los grandes bancos tradicionales.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Importe del Envío (€)
              </label>
              <input
                type="number"
                value={remittanceAmount}
                onChange={(e) => setRemittanceAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/10 pb-1 text-[11px]">
                <span>Canal de Envío</span>
                <span>Comisión Estimada</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Banca Tradicional (Swift)</span>
                <span className="text-rose-400 font-bold">{bankWireFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Fintechs Éticas (Remitly, Wise)</span>
                <span className="text-emerald-400 font-bold">{fintechFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-orange-400 font-bold">Ahorro para tu familia:</span>
                <span className="text-emerald-400 font-bold text-sm">+{savings.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Legal Warning Card */}
          <div className="glass-card p-6 rounded-2xl border border-amber-400/50 bg-amber-500/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>¿Qué hacer si un banco se niega a abrir tu cuenta?</span>
            </div>
            <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              Exige que te entreguen la denegación por escrito (están obligados por el art. 4 del RD 19/2017). Ningún director de sucursal puede alegar verbalmente "normas internas" por encima de un Real Decreto ley. Descarga nuestro modelo y preséntalo por registro o ventanilla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
