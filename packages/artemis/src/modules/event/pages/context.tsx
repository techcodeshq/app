import { useQuery } from "@hooks/useQuery";
import { Event } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";

const EventContext = createContext(null);

export const EventProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: event } = useQuery<Event>("/events/" + router.query.slug);

  return (
    <EventContext.Provider value={{ event }}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => {
  const event = useContext<{ event: Event }>(EventContext);
  return event;
};
