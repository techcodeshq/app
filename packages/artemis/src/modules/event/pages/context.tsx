import { Branch, Event } from "@prisma/client";
import { createContext, useContext } from "react";

const EventContext = createContext(null);

export const EventProvider: React.FC<{ event: Event }> = ({
  event,
  children,
}) => {
  return (
    <EventContext.Provider value={{ event }}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => {
  const event = useContext<{ event: Event }>(EventContext);
  return event;
};
