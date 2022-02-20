import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { TabHeading } from "@ui/tab-heading";
import { DashboardLayout } from "../dashboard/layout";
import { BranchCard } from "./card";
import { QueryBranch } from "./query";

export const DashboardBranchesView: React.FC = () => {
  const { data } = useQuery<QueryBranch[]>("/branch");

  return (
    <DashboardLayout>
      <TabHeading heading="Branches">
        <Flex>Search * Create</Flex>
      </TabHeading>
      <Box overflowY="auto" overflowX="hidden" h="100%">
        <SimpleGrid columns={{ base: 1, lg: 3, xl: 4 }} gap="2rem" mt="1rem">
          {data && data.map((branch) => <BranchCard branch={branch} />)}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
};
