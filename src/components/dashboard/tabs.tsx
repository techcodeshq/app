import { useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { DashboardTabs, useDashboard } from "./context";
import { EventsTab } from "./events-tab";
import { MembersTab } from "./members-tab";

const Tabs: React.FC = ({}) => {
  const { selectedTab, setSelectedTab } = useDashboard();

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault();
        return setSelectedTab(DashboardTabs.EVENTS);
      } else if (event.ctrlKey && event.key === "m")
        return setSelectedTab(DashboardTabs.MEMBERS);
    });
  }, []);

  switch (selectedTab) {
    case DashboardTabs.MEMBERS:
      return <MembersTab />;
    case DashboardTabs.EVENTS:
      return <EventsTab />;
  }
};

export default Tabs;
