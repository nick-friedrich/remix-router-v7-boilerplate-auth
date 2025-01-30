import { createContext, useContext } from "react";

interface SiteContextType {
  appName: string;
  baseUrl: string;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({
  children,
  appName,
  baseUrl,
}: {
  children: React.ReactNode;
  appName: string;
  baseUrl: string;
}) {
  return (
    <SiteContext.Provider value={{ appName, baseUrl }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
