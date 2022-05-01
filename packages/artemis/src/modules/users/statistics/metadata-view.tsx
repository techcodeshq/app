import { Flex, Tabs, useBreakpointValue } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { UserData } from "./data";
import { UserDataMobile } from "./data-mobile";
import { Query } from "./query";

export const MetadataView: React.FC = () => {
  // TODO: adjust the query type and api to fix this mess
  const { data } = useQuery<Query[]>("/users/metadata");
  const largeScreen = useBreakpointValue({ base: false, md: true });

  if (!data) return null;
  const metadata = data[0];

  return (
    <Flex
      h="100%"
      w="100%"
      mt="1rem"
      gap="1rem"
      flexDir={{ base: "column", md: "row" }}
    >
      {largeScreen ? (
        <UserData data={metadata} />
      ) : (
        <UserDataMobile data={metadata} />
      )}
    </Flex>
  );
};
