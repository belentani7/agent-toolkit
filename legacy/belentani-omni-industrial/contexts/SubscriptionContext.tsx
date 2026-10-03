import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

type SubscriptionTier = 'free' | 'premium' | 'admin';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  upgradeToPremium: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isUpgrading: boolean;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTier = useCallback(async (newTier: SubscriptionTier) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setIsUpgrading(true);
    setError(null);

    try {
      // Simular actualización de suscripción
      if (newTier === 'premium') {
        // Simular pago con Stripe
        console.log('💳 Procesando pago de €3.00...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('✅ Pago procesado correctamente');
      }

      setTier(newTier);
      localStorage.setItem('belentani_tier', newTier);
      console.log(`✅ Tier actualizado a: ${newTier}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar suscripción';
      setError(errorMsg);
      console.error('❌ Error:', errorMsg);
    } finally {
      setIsUpgrading(false);
    }
  }, [user]);

  const upgradeToPremium = useCallback(async () => {
    await updateTier('premium');
  }, [updateTier]);

  const downgradeToFree = useCallback(async () => {
    await updateTier('free');
  }, [updateTier]);

  const cancelSubscription = useCallback(async () => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setIsUpgrading(true);
    setError(null);

    try {
      console.log('🔄 Cancelando suscripción...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTier('free');
      localStorage.removeItem('belentani_tier');
      console.log('✅ Suscripción cancelada');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cancelar suscripción';
      setError(errorMsg);
    } finally {
      setIsUpgrading(false);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        upgradeToPremium,
        downgradeToFree,
        cancelSubscription,
        isUpgrading,
        error,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
