import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Check, Shield, Star, HelpCircle, Activity, Sparkles, TrendingUp, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const { profile } = useAuth();
  const { upgradeToPremium, downgradeToFree, isUpgrading } = useSubscription();

  const tiers = [
    {
      id: 'free',
      name: 'Standard Base Processing',
      price: '€0',
      description: 'Standard queue with artificial compilation delay & limited playback control.',
      features: [
        'Up to 10 songs per playlist limit',
        'Standard decelerated core response',
        'Tactical visual commercial interruptions',
        'Single-node generation parameter only',
        'Shared common audio synthesis bandwidth',
      ],
      buttonText: profile?.tier === 'free' ? 'Current Low Vector' : 'Select Standard Base',
      action: downgradeToFree,
      highlight: false,
    },
    {
      id: 'premium',
      name: 'Sovereign Premium Core',
      price: '€3.00',
      description: 'Zero compilation filters, priority quantum AI algorithms, and absolute sovereignty.',
      features: [
        'Up to 50 songs per playlist expansion',
        'Zero tactical visual commercial noise',
        'Unthrottled instant compilation response',
        'Cooperative Party Me roomId host privilege',
        'Unlimited saved high-fidelity neural archives',
        'Extended multi-node spec parameter control',
      ],
      buttonText: profile?.tier === 'premium' ? 'Sovereign Certified' : 'Acquire Sovereign Access',
      action: upgradeToPremium,
      highlight: true,
    },
  ];

  const comparisons = [
    { feature: 'Monthly Financial Burden', competitor: '€9.99 / month', belentani: '€3.00 / month (Bare-Metal Cost)', belentaniWinner: true },
    { feature: 'Cooperative Rave Party Remix Mode', competitor: 'Not Available', belentani: 'Fully Integrated Engine', belentaniWinner: true },
    { feature: 'Visual Art / Image Spectral Scanner', competitor: 'Highly Restricted', belentani: 'Uncapped Infinite Art Matrix', belentaniWinner: true },
    { feature: 'System Transparency / Sovereign Control', competitor: 'Corporate Throttled', belentani: 'Total Strategic Clarity', belentaniWinner: true },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-300 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header with status psychology */}
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <h2 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest leading-relaxed flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-zinc-500" />
          [ DECENTRALIZED VALUATION ARCHE ]
        </h2>
        <p className="mt-1 text-3xl font-black tracking-tighter text-white sm:text-5xl uppercase leading-none">
          ELEVATE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-amber-600/30 to-zinc-400 tracking-wide">COHERENCE PROTOCOL</span>
        </p>
        <p className="max-w-lg mt-3 mx-auto text-xs text-zinc-500 font-light leading-relaxed">
          Why conform to overpriced corporate music portals? We maintain zero ad-selling bloat. The €3 entry is scaled strictly to bare-metal computation costs to protect absolute player freedom.
        </p>
      </div>

      {/* Main pricing card layout */}
      <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:max-w-4xl lg:mx-auto xl:max-w-4xl xl:mx-auto">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            whileHover={{ scale: 1.015 }}
            className={`relative flex flex-col p-6 glass border rounded-2xl ${
              tier.highlight 
                ? 'border-zinc-700 shadow-sm bg-gradient-to-b from-zinc-900/40 to-transparent' 
                : 'border-zinc-900 shadow-sm bg-black/40'
            }`}
          >
            {tier.highlight && (
              <div className="absolute top-0 right-6 transform -translate-y-1/2 flex items-center gap-1 py-1 px-3.5 bg-zinc-800 text-zinc-200 text-[9px] font-mono font-black tracking-wider uppercase rounded-full border border-zinc-700">
                <Star className="w-2.5 h-2.5 fill-current text-zinc-400" />
                SUPREME COHERENCE SELECT
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-black block">Tier Config</span>
                <h3 className={`text-lg font-bold uppercase tracking-wider ${tier.highlight ? 'text-white' : 'text-zinc-300'}`}>{tier.name}</h3>
              </div>

              <div className="flex items-baseline text-white">
                <span className="text-4xl font-black font-mono text-zinc-100 tracking-tight">{tier.price}</span>
                <span className="ml-1 text-xs font-mono text-zinc-500">/month</span>
              </div>
              
              <p className="text-xs text-zinc-400 font-light leading-relaxed min-h-[32px]">{tier.description}</p>
              
              <div className="border-t border-zinc-900 pt-4" />

              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs">
                    {tier.highlight ? (
                      <Check className="flex-shrink-0 w-3.5 h-3.5 text-zinc-300 mt-0.5" />
                    ) : (
                      <div className="w-3.5 h-3.5 border border-zinc-900 rounded-md flex items-center justify-center mt-0.5 text-zinc-500 text-[8px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                    <span className={`ml-2.5 font-light ${tier.highlight ? 'text-zinc-200' : 'text-zinc-400'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={tier.action}
              disabled={isUpgrading || profile?.tier === tier.id}
              className={`mt-6 block w-full py-3 px-6 rounded-xl text-center font-bold uppercase tracking-widest text-[10px] transition-all duration-300 cursor-pointer ${
                tier.highlight
                  ? 'bg-zinc-100 text-black hover:bg-white'
                  : 'bg-black/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-900/40 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUpgrading ? 'TRANSMITTING COORD...' : tier.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Psychology Anchoring Section: Competitor Matrix */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
            // TACTICAL GRID COMPARISON
          </h3>
          <p className="text-xs text-zinc-500 uppercase font-light">
            How Belentani Core matches up against rigid monopolized corporate streams
          </p>
        </div>

        <div className="glass hud-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-900 grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-black">
            <div>Vector Dimension</div>
            <div className="text-center text-red-500/60">Standard Competitor</div>
            <div className="text-right text-zinc-300">Belentani Sovereign</div>
          </div>
          <div className="divide-y divide-zinc-900">
            {comparisons.map((row, idx) => (
              <div key={idx} className="p-4 grid grid-cols-3 gap-2 items-center text-xs">
                <div className="font-light text-zinc-300">{row.feature}</div>
                <div className="text-center font-mono text-zinc-500 text-[11px] line-through decoration-red-950/50">{row.competitor}</div>
                <div className="text-right font-mono text-zinc-200 font-bold">
                  {row.belentani}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] font-mono text-center text-zinc-550 uppercase tracking-wider leading-relaxed">
          * Decelerated processing is applied for standard tiers to prioritize premium graphics rendering power.
        </p>
      </div>
    </div>
  );
};

export default Pricing;

