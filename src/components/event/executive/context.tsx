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

// export enum EventTabs {
//   TASKS = "tasks",
//   LINKS = "links",
// }

export class EventTabs {
  public static TASKS = new EventTabs("tasks", "/tasks", "Tasks");
  public static LINKS = new EventTabs("links", "/links", "Links");

  private constructor(
    private readonly name: string,
    public readonly url: string,
    private readonly publicName: string,
  ) {}

  public isSelected(url: string): boolean {
    return url.includes(this.url);
  }

  toString() {
    return this.publicName;
  }
}

export interface ContextResult {
  event: Event;
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
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        return router.push(`/event/${event.slug}${EventTabs.LINKS.url}`);
      } else if (e.altKey && e.key === "t") {
        e.preventDefault();
        return router.push(`/event/${event.slug}${EventTabs.TASKS.url}`);
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
