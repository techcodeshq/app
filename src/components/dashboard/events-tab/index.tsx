import { Heading } from "@chakra-ui/react";
import React from "react";
import { TabLayout } from "../tab-layout";

export const EventsTab: React.FC = ({}) => {
  return (
    <TabLayout>
      <Heading fontSize="1.5rem" fontWeight="regular" mt="2rem">
        Coming soon to a TechCodes app near you!
      </Heading>
    </TabLayout>
  );
};
