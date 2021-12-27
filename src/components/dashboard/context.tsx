import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext(null);

export enum DashboardTabs {
  MEMBERS = "Members",
  EVENTS = "Events",
}

export interface ContextResult {
  selectedTab: DashboardTabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<DashboardTabs>>;
}

export const DashboardProvider: React.FC = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(DashboardTabs.MEMBERS);

  return (
    <DashboardContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const data = useContext<ContextResult>(DashboardContext);

  return data;
};
