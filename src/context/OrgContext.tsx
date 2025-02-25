import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Create a Context for organization data
const OrgContext = createContext<{
  orgData: any | null;
  setOrgData: (org: any) => void;
} | undefined>(undefined);

export const OrgProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orgData, setOrgDataState] = useState<any | null>(null);

  // Load orgData from sessionStorage when the component mounts
  useEffect(() => {
    const savedOrgData = sessionStorage.getItem('orgData');
    if (savedOrgData) {
      setOrgDataState(JSON.parse(savedOrgData));
    }
  }, []);

  // Function to set orgData and save it to sessionStorage
  const setOrgData = (newOrgData: any) => {
    setOrgDataState(newOrgData);
    sessionStorage.setItem('orgData', JSON.stringify(newOrgData));
  };

  return (
    <OrgContext.Provider value={{ orgData, setOrgData }}>
      {children}
    </OrgContext.Provider>
  );
};

// Custom hook to use the OrgContext
export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
};
