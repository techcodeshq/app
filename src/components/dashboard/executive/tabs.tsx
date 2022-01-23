import React, { useEffect } from "react";
import { DashboardTabs, useDashboard } from "./context";
import { EventsTab } from "./events-tab";
import { MembersTab } from "./members-tab";
import { TodosTab } from "./todos-tab";

const Tabs: React.FC = ({}) => {
  const { selectedTab, setSelectedTab } = useDashboard();

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "e") {
        event.preventDefault();
        return setSelectedTab(DashboardTabs.EVENTS);
      } else if (event.altKey && event.key === "m") {
        return setSelectedTab(DashboardTabs.MEMBERS);
      } else if (event.altKey && event.key === "t") {
        return setSelectedTab(DashboardTabs.TODOS);
      }
    });
  }, []);

  switch (selectedTab) {
    case DashboardTabs.MEMBERS:
      return <MembersTab />;
    case DashboardTabs.EVENTS:
      return <EventsTab />;
    case DashboardTabs.TODOS:
      return <TodosTab />;
  }
};

export default Tabs;
