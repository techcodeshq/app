import { Link, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { Event } from "@prisma/client";
import { useBranch } from "../branch/pages/context";
import { EventCard } from "./card";

export const EventsGrid: React.FC = () => {
  const { branch } = useBranch();
  const { data } = useQuery<Event[]>(`/branch/${branch.id}/events`);

  return (
    <SimpleGrid columns={{ base: 1, lg: 3, xl: 4 }} gap="2rem" mt="1rem">
      {data && data.map((event) => <EventCard event={event} />)}
    </SimpleGrid>
  );
};
