import { UseDisclosureReturn } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { EventTabs, useEvent } from "./context";
import { TasksTab } from "./tasks-tab";
import { LinksTab } from "./links-tab";
import { TaskProvider } from "./tasks-tab/context";
import { HistoryData } from "src/types/history";

const Tabs: React.FC<{
  linkCreate: UseDisclosureReturn;
  eventCreate: UseDisclosureReturn;
  history: HistoryData;
}> = ({ linkCreate, eventCreate, history }) => {
  const { selectedTab, setSelectedTab } = useEvent();

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "l") {
        event.preventDefault();
        return setSelectedTab(EventTabs.LINKS);
      } else if (event.altKey && event.key === "t")
        return setSelectedTab(EventTabs.TASKS);
    });
  }, []);

  switch (selectedTab) {
    case EventTabs.LINKS:
      return <LinksTab linkCreate={linkCreate} />;
    case EventTabs.TASKS:
      return (
        <TaskProvider history={history}>
          <TasksTab eventCreate={eventCreate} />
        </TaskProvider>
      );
  }
};

export default Tabs;
