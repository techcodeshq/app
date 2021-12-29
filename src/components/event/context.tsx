import { useRouter } from "next/router";
import type { Event } from "@typings/event";
import React, { createContext, useCallback, useContext, useState } from "react";

const EventContext = createContext(null);

export enum EventTabs {
  TASKS = "Tasks",
  LINKS = "Links",
}

export interface ContextResult {
  event: Event;
  selectedTab: EventTabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<EventTabs>>;
  searchFilter: (item: any) => boolean;
  setSearchFilter: React.Dispatch<React.SetStateAction<(item: any) => boolean>>;
}

export const EventProvider: React.FC<{ event: Event }> = ({
  children,
  event,
}) => {
  const router = useRouter();
  const [selectedTab, _setSelectedTab] = useState(
    router.query.tab || EventTabs.TASKS
  );
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  const setSelectedTab = useCallback(
    (tab: EventTabs) => {
      const query = new URLSearchParams({ ...router.query, tab: tab });
      router.push({ query: query.toString() });
      _setSelectedTab(tab);
    },
    [selectedTab, _setSelectedTab]
  );

  return (
    <EventContext.Provider
      value={{
        event,
        selectedTab,
        setSelectedTab,
        searchFilter,
        setSearchFilter,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const data = useContext<ContextResult>(EventContext);

  return data;
};
