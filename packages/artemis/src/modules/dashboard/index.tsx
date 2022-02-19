import { Flex, Heading, Icon, useDisclosure } from "@chakra-ui/react";
import { TabHeading } from "@ui/tab-heading";
import { BiMenuAltRight } from "react-icons/bi";
import { BranchCard } from "./branch/card";
import { BranchSwiper } from "./branch/swiper";
import { EventsSwiper } from "./event/swiper";
import { DashboardLayout } from "./layout";
import { TaskDrawer } from "./task-drawer";

export const DashboardView: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <DashboardLayout>
      <TabHeading heading="Good Morning, George">
        <Icon
          as={BiMenuAltRight}
          w="2rem"
          h="2rem"
          onClick={onOpen}
          _hover={{ cursor: "pointer" }}
        />
      </TabHeading>
      <Flex flexDir="column" h="100%" gap="2rem" mt="1rem">
        <Flex flex="1.5" flexDir="column" gap="0.5rem">
          <Heading fontWeight="regular" fontSize="1.5rem">
            Your Branches
          </Heading>
          <Flex h="100%" mt="1rem">
            <BranchSwiper />
          </Flex>
        </Flex>
        <Flex flex="1" flexDir="column" h="100%">
          <Heading fontWeight="regular" fontSize="1.5rem">
            Your Events
          </Heading>
          <Flex h="100%" mt="1rem">
            <EventsSwiper />
          </Flex>
        </Flex>
        <Flex flex="1">
          <Heading fontWeight="regular" fontSize="1.5rem">
            Your Meetings
          </Heading>
        </Flex>
      </Flex>
      <TaskDrawer isOpen={isOpen} onClose={onClose} />
    </DashboardLayout>
  );
};
