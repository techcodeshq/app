import { useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { MembersGrid } from "./members-grid";
import { MembersList } from "./members-list";

export const MembersTab: React.FC = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return !isMobile ? <MembersGrid /> : <MembersList />;
};
