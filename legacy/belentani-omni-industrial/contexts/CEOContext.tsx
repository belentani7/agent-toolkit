import React, { createContext, useContext, useState } from 'react';

interface CEOStrategy {
  themeColor?: string;
  aiModel?: string;
  maxPlaylistLength?: number;
}

interface CEOConfig {
  killSwitch?: boolean;
  maintenanceMode?: boolean;
}

interface CEOContextType {
  strategy: CEOStrategy;
  config: CEOConfig;
  updateStrategy: (strategy: Partial<CEOStrategy>) => void;
  updateConfig: (config: Partial<CEOConfig>) => void;
}

const CEOContext = createContext<CEOContextType | undefined>(undefined);

export const CEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strategy, setStrategy] = useState<CEOStrategy>({
    themeColor: '#d9a85d',
    aiModel: 'gemini-3-flash',
    maxPlaylistLength: 50,
  });

  const [config, setConfig] = useState<CEOConfig>({
    killSwitch: false,
    maintenanceMode: false,
  });

  const updateStrategy = (newStrategy: Partial<CEOStrategy>) => {
    setStrategy((prev) => ({ ...prev, ...newStrategy }));
  };

  const updateConfig = (newConfig: Partial<CEOConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <CEOContext.Provider
      value={{
        strategy,
        config,
        updateStrategy,
        updateConfig,
      }}
    >
      {children}
    </CEOContext.Provider>
  );
};

export const useCEO = () => {
  const context = useContext(CEOContext);
  if (!context) {
    throw new Error('useCEO must be used within CEOProvider');
  }
  return context;
};
