import {
  Box,
  Divider,
  Flex,
  Heading,
  Select,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { actionBasedColor } from "@modules/dashboard/statistics/actionBasedColor";
import { useQuery } from "@hooks/useQuery";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import {
  Branch,
  EventLink,
  EventLinkRedeem,
  LinkApplyInstructions,
  UserMetadata,
} from "@prisma/client";
import moment from "moment";
import { useEffect, useState } from "react";
import { MemberData } from "./data";
import { MemberDataMobile } from "./data-mobile";
import { Query } from "./query";

export const BranchMetadataTabs: React.FC = () => {
  const { data: metadata } = useQuery<Query[]>("/users/metadata");
  const [selected, setSelected] = useState<Query>(null);
  const largeScreen = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    console.log("dwa", selected, metadata);
    if (!selected && metadata) {
      return setSelected(metadata[0]);
    }
  }, [metadata]);

  return (
    <Flex
      h="100%"
      w="100%"
      as={Tabs}
      mt="1rem"
      gap="1rem"
      flexDir={{ base: "column", md: "row" }}
    >
      <Flex flex="2" flexDir="column" gap="0.5rem">
        <Heading fontSize="1.2rem" fontWeight="regular">
          Branches
        </Heading>
        {metadata &&
          largeScreen &&
          metadata.map((item) => (
            <Box
              key={item.branch.id}
              p="0.8rem"
              _hover={{ cursor: "pointer" }}
              borderRadius="0.5rem"
              bgColor={selected === item ? "bg.700" : null}
              onClick={() => setSelected(item)}
            >
              {item.branch.name}
            </Box>
          ))}
        {metadata && !largeScreen && (
          <Select
            onChange={(event) => {
              setSelected(
                metadata.find(
                  (_, index) => index == parseInt(event.target.value),
                ),
              );
            }}
          >
            {metadata.map((metadata, index) => (
              <option value={index} key={index}>
                {metadata.branch.name}
              </option>
            ))}
          </Select>
        )}
      </Flex>
      {largeScreen && <Divider orientation="vertical" />}
      <Flex flex="5" flexDir="column" gap="0.5rem">
        {selected && largeScreen && <MemberData data={selected} />}
        {selected && !largeScreen && <MemberDataMobile data={selected} />}
      </Flex>
    </Flex>
  );
};
