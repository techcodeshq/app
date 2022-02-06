import { Tabs } from "@lib/util/tabs";
import type { Event } from "@prisma/client";
import { NextRouter, useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BsLink, BsListTask } from "react-icons/bs";

const EventContext = createContext(null);

export class EventTabs extends Tabs {
  public static LINKS = new EventTabs("links", "Links", BsLink);
  public static TASKS = new EventTabs("tasks", "Tasks", BsListTask);

  public getPushRoute(router: NextRouter): string {
    return `/event/${router.query.slug}/${this.name}`;
  }
}

export interface ContextResult {
  event: Event;
  searchFilter: (item: any) => boolean;
  setSearchFilter: React.Dispatch<React.SetStateAction<(item: any) => boolean>>;
}

export const EventProvider: React.FC<{ event: Event }> = ({
  children,
  event,
}) => {
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        return router.push(EventTabs.LINKS.getPushRoute(router));
      } else if (e.altKey && e.key === "t") {
        e.preventDefault();
        return router.push(EventTabs.TASKS.getPushRoute(router));
      }
    });
  }, []);

  return (
    <EventContext.Provider
      value={{
        event,
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
