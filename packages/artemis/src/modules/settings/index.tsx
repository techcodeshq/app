import { DashboardLayout } from "../dashboard/layout";
import { TabHeading } from "@ui/tab-heading";
import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { AccountSettings } from "./account-settings";
import { RoleSettings } from "./role-settings";
import { SettingsTabLayout } from "./layout";
import { HiOutlineUser, HiOutlineIdentification } from "react-icons/hi";

export const DashboardSettingsView: React.FC = () => {
  return (
    <DashboardLayout>
      <TabHeading heading="Settings" />

      <SettingsTabLayout
        sections={[
          {
            name: "Account",
            perms: [],
            component: AccountSettings,
            icon: HiOutlineUser,
          },
          {
            name: "Roles",
            perms: ["MANAGE_ROLES"],
            component: RoleSettings,
            icon: HiOutlineIdentification,
          },
        ]}
      />
    </DashboardLayout>
  );
};
