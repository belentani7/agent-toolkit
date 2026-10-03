import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { omniAutonomy, type OmniRuntimeSnapshot } from '../services/omniAutonomy';
import type { OmniPayloadMap, OmniPriority, OmniTaskKind } from '../types';

interface OmniContextValue {
  snapshot: OmniRuntimeSnapshot;
  enqueue: <K extends OmniTaskKind>(kind: K, payload: OmniPayloadMap[K], priority?: OmniPriority) => string | null;
  cancel: (taskId: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSafeMode: (safeMode: boolean) => void;
  emergencyStop: () => void;
  resumeAfterStop: () => void;
  clearHistory: () => void;
}

const OmniContext = createContext<OmniContextValue | undefined>(undefined);

export const OmniProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snapshot, setSnapshot] = useState<OmniRuntimeSnapshot>(omniAutonomy.getSnapshot());

  useEffect(() => omniAutonomy.subscribe((event) => setSnapshot(event.snapshot)), []);

  const value = useMemo<OmniContextValue>(() => ({
    snapshot,
    enqueue: <K extends OmniTaskKind>(kind: K, payload: OmniPayloadMap[K], priority: OmniPriority = 3) => omniAutonomy.enqueue(kind, payload, priority),
    cancel: (taskId) => omniAutonomy.cancel(taskId),
    setEnabled: (enabled) => omniAutonomy.setEnabled(enabled),
    setSafeMode: (safeMode) => omniAutonomy.setSafeMode(safeMode),
    emergencyStop: () => omniAutonomy.emergencyStop(),
    resumeAfterStop: () => omniAutonomy.resumeAfterStop(),
    clearHistory: () => omniAutonomy.clearHistory(),
  }), [snapshot]);

  return <OmniContext.Provider value={value}>{children}</OmniContext.Provider>;
};

export const useOmni = () => {
  const context = useContext(OmniContext);
  if (!context) throw new Error('useOmni must be used within OmniProvider');
  return context;
};
