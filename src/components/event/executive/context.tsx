import type { Event } from "@typings";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

const getTab = (tab: string | undefined) => {
  if (tab && Object.values(EventTabs).includes(tab as any)) return tab;

  return EventTabs.LINKS;
};

export const EventProvider: React.FC<{ event: Event }> = ({
  children,
  event,
}) => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(
    getTab(router.query.tab as string),
  );
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  const handleRouteChange = (url: string) => {
    const tab = url.split("/", 4).reverse()[0];
    setSelectedTab(tab);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const query = new URLSearchParams({
      ...router.query,
      tab: selectedTab as string,
    });
    router.push({ query: query.toString() });
  }, [selectedTab]);

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
