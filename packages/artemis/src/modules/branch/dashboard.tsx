import { Box, Button, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { TabHeading } from "@ui/tab-heading";
import { DashboardLayout } from "../dashboard/layout";
import { BranchCard } from "./card";
import { CreateBranch } from "./create-branch";
import { QueryBranch } from "./query";

export const DashboardBranchesView: React.FC = () => {
  const { data } = useQuery<QueryBranch[]>("/branches");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <DashboardLayout>
      <TabHeading heading="Branches">
        <Flex>
          <RenderIfAllowed requireIncredible={true}>
            <Button onClick={onOpen}>Create</Button>
          </RenderIfAllowed>
        </Flex>
      </TabHeading>
      <Box overflow={{ base: null, md: "hidden auto" }} h="100%">
        <SimpleGrid columns={{ base: 1, lg: 3, xl: 4 }} gap="2rem" mt="1rem">
          {data && data.map((branch) => <BranchCard branch={branch} />)}
        </SimpleGrid>
      </Box>
      <CreateBranch isOpen={isOpen} onClose={onClose} />
    </DashboardLayout>
  );
};
