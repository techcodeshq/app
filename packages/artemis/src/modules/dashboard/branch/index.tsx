import { Flex, SimpleGrid } from "@chakra-ui/react";
import { TabHeading } from "@ui/tab-heading";
import { DashboardLayout } from "../layout";
import { BranchCard } from "./card";

export const DashboardBranchesView: React.FC = () => {
  return (
    <DashboardLayout>
      <TabHeading heading="Branches">
        <Flex>Search * Create</Flex>
      </TabHeading>
      <SimpleGrid
        h="100%"
        columns={{ base: 1, lg: 3, xl: 4 }}
        gap="2rem"
        mt="1rem"
        overflowY="auto"
        overflowX="hidden"
      >
        {[...Array(20)].map((branch) => (
          <BranchCard />
        ))}
      </SimpleGrid>
    </DashboardLayout>
  );
};
