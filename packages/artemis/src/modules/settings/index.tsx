import { DashboardLayout } from "../dashboard/layout";
import { TabHeading } from "@ui/tab-heading";
import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { AccountSettings } from "./account-settings";
import { RoleSettings } from "./role-settings";
import { SettingsAccordionLayout } from "./layout";
import { HiOutlineUser, HiOutlineIdentification } from "react-icons/hi";

export const DashboardSettingsView: React.FC = () => {
  const bgColor = useColorModeValue("bg.50", "bg.800");

  return (
    <DashboardLayout>
      <TabHeading heading="Settings" />

      <SettingsAccordionLayout
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
