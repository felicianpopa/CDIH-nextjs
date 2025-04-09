"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { mainConfigurations } from "./mainConfigurations";

type ConfigContextType = typeof mainConfigurations;

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  console.warn(mainConfigurations);
  return (
    <ConfigContext.Provider value={mainConfigurations}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
