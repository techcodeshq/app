import { useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { EventTabs, useEvent } from "./context";
import EventHeader from "./header";
import { LinksTab } from "./links-tab";

const Tabs: React.FC = ({}) => {
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
      return <LinksTab />;
    case EventTabs.TASKS:
      return (
        <div>
          <EventHeader onOpen={() => null} />
          hi
        </div>
      );
  }
};

export default Tabs;
