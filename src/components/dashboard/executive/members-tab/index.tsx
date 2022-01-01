import React from "react";
import { TabLayout } from "../tab-layout";
import { MembersGrid } from "./members-grid";

export const MembersTab: React.FC = ({}) => {
  return (
    <TabLayout>
      <MembersGrid />
    </TabLayout>
  );
};
