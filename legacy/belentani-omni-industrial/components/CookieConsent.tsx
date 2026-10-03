import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    setShowDetails(false);
    // Trigger analytics if accepted
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
      });
    }
  };

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie_consent', JSON.stringify(rejected));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-lg mx-auto glass border border-amber-500/20 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Gestión de Cookies y Privacidad</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Utilizamos cookies para mejorar tu experiencia. Consulta nuestra{' '}
                    <a href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                      Política de Privacidad
                    </a>
                    .
                  </p>
                </div>
              </div>
              <button
                onClick={handleRejectAll}
                className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showDetails ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-xs font-mono font-bold text-zinc-400 border border-zinc-700 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-all"
                >
                  RECHAZAR TODO
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-xs font-mono font-bold text-amber-400 border border-amber-500/30 rounded-lg hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                >
                  PERSONALIZAR
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
                >
                  ACEPTAR TODO
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-xs text-zinc-300">
                      <strong>Esenciales</strong> - Requeridas para funcionamiento
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-xs text-zinc-300">
                      <strong>Analítica</strong> - Entender cómo usas BELENTANI
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-xs text-zinc-300">
                      <strong>Marketing</strong> - Publicidad personalizada
                    </span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-4 py-2 text-xs font-mono font-bold text-zinc-400 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all"
                  >
                    RECHAZAR
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all"
                  >
                    GUARDAR
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
