import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Brain, Music, Compass, Volume2, Lock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

interface ArtisticDecision {
  songTitle: string;
  artist: string;
  reason: string;
  emotionalLayer: string;
  artisticProgression: string;
  vibeScore: number;
}

interface QuantumExperienceProps {
  playlistId?: string;
}

/**
 * Página de Experiencia Cuántica
 * Centro integrado de las 5 mejoras evolutivas de BELENTANI
 */
const QuantumExperience: React.FC<QuantumExperienceProps> = ({ playlistId }) => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [activeTab, setActiveTab] = useState<'coherence' | 'sovereignty' | 'command' | 'party' | 'value'>('coherence');
  const [decisions, setDecisions] = useState<ArtisticDecision[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [convergenceScore, setConvergenceScore] = useState(87);

  // Simular generación de decisiones artísticas
  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        setDecisions([
          {
            songTitle: 'Midnight Dreams',
            artist: 'Luna Echo',
            reason: 'Resonancia perfecta con la nostalgia melancólica de tu prompt',
            emotionalLayer: 'Introspección profunda con esperanza sutilmente creciente',
            artisticProgression: 'Transición ideal desde lo introspectivo hacia la aceptación',
            vibeScore: 94,
          },
          {
            songTitle: 'Neon Pulse',
            artist: 'Synth Wave Collective',
            reason: 'Amplificación del contraste emocional solicitado',
            emotionalLayer: 'Energía urbana con vulnerabilidad subyacente',
            artisticProgression: 'Puente narrativo entre introspección y movimiento',
            vibeScore: 89,
          },
        ]);
        setIsGenerating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-8"
    >
      {/* Header */}
      <div className="glass border border-amber-500/20 rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-black text-white">Experiencia Cuántica</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-mono">BELENTANI 2.0 EVOLVED</p>
            <p className="text-sm font-bold text-amber-400">{tier === 'premium' ? '✓ Premium' : 'Free'}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Bienvenido al futuro de la música generativa. Aquí convergen las 5 mejoras evolutivas que hacen a BELENTANI 5 veces mejor que la competencia.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'coherence', label: 'Coherencia Cuántica', icon: Brain },
          { id: 'sovereignty', label: 'Soberanía', icon: Lock },
          { id: 'command', label: 'Centro de Mando', icon: Volume2 },
          { id: 'party', label: 'Modo Fiesta', icon: Music },
          { id: 'value', label: 'Valor Bare-Metal', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              className={`glass border rounded-lg p-3 text-center transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-amber-500/60 bg-amber-500/10'
                  : 'border-amber-500/10 hover:border-amber-500/30'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xs font-bold text-white">{tab.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'coherence' && (
          <motion.div
            key="coherence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-amber-400" />
                Coherencia Artística Cuántica
              </h2>
              <p className="text-sm text-zinc-400">
                La IA analiza no solo géneros y tempos, sino la narrativa emocional y la intención artística detrás de cada solicitud.
              </p>
              <button
                onClick={() => setIsGenerating(true)}
                disabled={isGenerating}
                className="w-full glass border border-amber-500/30 hover:border-amber-500/60 rounded-lg py-3 font-bold text-amber-400 hover:text-amber-300 transition-all duration-300 disabled:opacity-50"
              >
                {isGenerating ? '⚡ Analizando coherencia cuántica...' : 'Generar Playlist Coherente'}
              </button>

              {decisions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-amber-500/10">
                  {decisions.map((decision, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass border border-amber-500/10 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white">{decision.songTitle}</h4>
                          <p className="text-xs text-zinc-500">{decision.artist}</p>
                        </div>
                        <span className="text-2xl font-black text-amber-400">{decision.vibeScore}%</span>
                      </div>
                      <p className="text-xs text-zinc-300">{decision.reason}</p>
                      <p className="text-xs text-amber-300 italic">{decision.emotionalLayer}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'sovereignty' && (
          <motion.div
            key="sovereignty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-400" />
              Soberanía de Datos
            </h2>
            <p className="text-sm text-zinc-400">
              Controla exactamente qué datos usa la IA para personalización. Transparencia total.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Historial de Escucha', enabled: true, impact: 'Alto' },
                { name: 'Ubicación', enabled: false, impact: 'Medio' },
                { name: 'Preferencias de Mood', enabled: true, impact: 'Alto' },
                { name: 'Datos de Redes Sociales', enabled: false, impact: 'Bajo' },
              ].map((perm, idx) => (
                <div key={idx} className="glass border border-amber-500/10 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{perm.name}</p>
                    <p className="text-xs text-zinc-500">Impacto: {perm.impact}</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors ${perm.enabled ? 'bg-amber-500/30' : 'bg-zinc-800'}`}>
                    <motion.div
                      animate={{ x: perm.enabled ? 20 : 2 }}
                      className="w-5 h-5 bg-amber-400 rounded-full mt-1 ml-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'command' && (
          <motion.div
            key="command"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-amber-400" />
              Centro de Comando Sónico
            </h2>
            <p className="text-sm text-zinc-400">
              Interfaz inmersiva que reacciona en tiempo real a la música generada.
            </p>
            <div className="bg-black/50 rounded-xl border border-amber-500/20 h-32 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-amber-400 font-mono">Visualizador en Tiempo Real</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Energía: 87%', 'Coherencia: 94%', 'Mood Match: 91%', 'Fluidez: 88%'].map((stat, idx) => (
                <div key={idx} className="glass border border-amber-500/10 rounded-lg p-3 text-center">
                  <p className="text-xs font-mono text-amber-400">{stat}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'party' && (
          <motion.div
            key="party"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Music className="w-6 h-6 text-amber-400" />
              Modo Fiesta 2.0
            </h2>
            <p className="text-sm text-zinc-400">
              Convergencia de mentes musicales. Múltiples usuarios influyen en la dirección artística en tiempo real.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-bold text-white">Convergencia: {convergenceScore}%</p>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${convergenceScore}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                />
              </div>
            </div>
            <button className="w-full glass border border-amber-500/30 hover:border-amber-500/60 rounded-lg py-3 font-bold text-amber-400 transition-all duration-300">
              + Invitar a Fiesta
            </button>
          </motion.div>
        )}

        {activeTab === 'value' && (
          <motion.div
            key="value"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              Modelo Bare-Metal
            </h2>
            <p className="text-sm text-zinc-400">
              Cada euro se destina a computación e infraestructura. Transparencia total.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/50 rounded-lg p-4 space-y-1">
                <p className="text-xs text-zinc-500 font-mono">Suscripción Mensual</p>
                <p className="text-2xl font-black text-amber-400">€3.00</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 space-y-1">
                <p className="text-xs text-zinc-500 font-mono">Computación IA</p>
                <p className="text-2xl font-black text-orange-400">€2.10</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 space-y-1">
                <p className="text-xs text-zinc-500 font-mono">Infraestructura</p>
                <p className="text-2xl font-black text-amber-400">€0.60</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 space-y-1">
                <p className="text-xs text-zinc-500 font-mono">Investigación</p>
                <p className="text-2xl font-black text-orange-400">€0.30</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Status */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(217, 168, 93, 0.3)',
            '0 0 40px rgba(217, 168, 93, 0.6)',
            '0 0 20px rgba(217, 168, 93, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="glass border border-amber-500/20 rounded-xl p-4 text-center text-xs font-mono text-amber-400"
      >
        ⚡ BELENTANI 2.0 EVOLVED - Las 5 Mejoras Disruptivas Activas
      </motion.div>
    </motion.div>
  );
};

export default QuantumExperience;
