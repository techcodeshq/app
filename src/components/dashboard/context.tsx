import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext(null);

export enum DashboardTabs {
  MEMBERS = "Members",
  EVENTS = "Events",
}

export interface ContextResult {
  selectedTab: DashboardTabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<DashboardTabs>>;
  searchFilter: (item: any) => boolean;
  setSearchFilter: React.Dispatch<React.SetStateAction<(item: any) => boolean>>;
}

export const DashboardProvider: React.FC = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(DashboardTabs.MEMBERS);
  const [searchFilter, setSearchFilter] = useState(() => (item) => true);

  return (
    <DashboardContext.Provider
      value={{ selectedTab, setSelectedTab, searchFilter, setSearchFilter }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const data = useContext<ContextResult>(DashboardContext);

  return data;
};
