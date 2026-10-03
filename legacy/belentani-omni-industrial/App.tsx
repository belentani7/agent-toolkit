import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { CEOProvider, useCEO } from './contexts/CEOContext';
import { OmniProvider } from './contexts/OmniContext';
import { I18nProvider } from './contexts/I18nContext';
import { Navbar } from './components/Navbar';
import { CookieConsent } from './components/CookieConsent';
import SkipLink from './components/SkipLink';
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const About = React.lazy(() => import('./pages/About'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const CEODashboard = React.lazy(() => import('./pages/CEODashboard'));
const QuantumExperience = React.lazy(() => import('./pages/QuantumExperience'));
const OmniConsole = React.lazy(() => import('./pages/OmniConsole'));
import { motion, AnimatePresence } from 'framer-motion';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 shadow-[0_0_15px_rgba(217,168,93,0.3)]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  const isAdmin = profile?.tier === 'admin' || user?.email === 'belentani7pedro@gmail.com';
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

const RouteFallback: React.FC = () => (
  <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-3 text-amber-300">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" aria-hidden="true" />
      <span className="text-xs font-mono uppercase tracking-widest">Cargando módulo</span>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { strategy, config } = useCEO();
  
  // Apply CEO's theme color if available
  React.useEffect(() => {
    if (strategy?.themeColor) {
      document.documentElement.style.setProperty('--primary-color', strategy.themeColor);
    }
  }, [strategy]);

  // Synchronize layout theme state
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (savedTheme !== 'dark' && prefersLight)) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  if (config?.killSwitch) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-black tracking-tighter text-red-600">SYSTEM OFFLINE</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            The CEO has initiated a global shutdown for strategic maintenance. 
            The company is pivoting.
          </p>
          <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">
            Ownership: belentani7pedro@gmail.com
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-300 transition-colors duration-500 flex flex-col noia-atmosphere">
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8 flex-1 outline-none">
        <AnimatePresence mode="wait">
          <React.Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quantum" element={<QuantumExperience />} />
            <Route path="/omni" element={<OmniConsole />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/ceo"
              element={
                <AdminRoute>
                  <CEODashboard />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </AnimatePresence>
      </main>
      <footer className="w-full border-t border-zinc-900 bg-[#0c0c0e]/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <a href="/privacy" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Privacidad
            </a>
            <a href="/terms" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Términos
            </a>
            <a href="https://instagram.com/belentani" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Instagram
            </a>
            <a href="mailto:support@belentani.com" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Soporte
            </a>
          </div>
          <div className="pt-4 border-t border-zinc-900 text-center">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} BELENTANI. Coherencia Absoluta.
              <br />
              <span className="text-zinc-700 font-mono text-[10px]">LEVEL 5 SOVEREIGN PROTOCOL</span>
            </p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <CEOProvider>
          <Router>
            <I18nProvider>
              <OmniProvider>
                <AppContent />
              </OmniProvider>
            </I18nProvider>
          </Router>
        </CEOProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;
