import { useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useState } from "react";

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
  const router = useRouter();
  const [selectedTab, _setSelectedTab] = useState(
    router.query.tab || DashboardTabs.EVENTS
  );
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  const setSelectedTab = useCallback(
    (tab: DashboardTabs) => {
      const query = new URLSearchParams({ ...router.query, tab: tab });
      router.push({ query: query.toString() });
      _setSelectedTab(tab);
    },
    [selectedTab, _setSelectedTab]
  );

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
