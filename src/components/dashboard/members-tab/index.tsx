import React from "react";
import { MembersGrid } from "./members-grid";
import { TabLayout } from "../tab-layout";

export const MembersTab: React.FC = ({}) => {
  return (
    <TabLayout>
      <MembersGrid />
    </TabLayout>
  );
};
