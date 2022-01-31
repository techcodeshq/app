import { Tabs } from "@lib/util/tabs";
import { NextRouter, useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useState } from "react";
import {
  BsCalendarEventFill,
  BsFillPersonLinesFill,
  BsListTask,
} from "react-icons/bs";

const DashboardContext = createContext(null);

export class DashboardTabs extends Tabs {
  public static TODOS = new DashboardTabs("todos", "Todos", BsListTask);
  public static EVENTS = new DashboardTabs(
    "events",
    "Events",
    BsCalendarEventFill,
  );
  public static MEMBERS = new DashboardTabs(
    "members",
    "Members",
    BsFillPersonLinesFill,
  );

  public getPushRoute(_: NextRouter): string {
    return `/dashboard/${this.name}`;
  }
}

export interface ContextResult {
  searchFilter: (item: any) => boolean;
  setSearchFilter: React.Dispatch<React.SetStateAction<(item: any) => boolean>>;
}
export const DashboardProvider: React.FC = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState(() => (_) => true);

  return (
    <DashboardContext.Provider value={{ searchFilter, setSearchFilter }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const data = useContext<ContextResult>(DashboardContext);

  return data;
};
