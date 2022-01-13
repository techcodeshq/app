import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import { EventTabs } from "@components/event/executive/context";
import { signOut } from "next-auth/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { DashboardTabs } from "../dashboard/executive/context";

export const NavMenu: React.FC<{
  tabs: typeof EventTabs | typeof DashboardTabs;
  setSelectedTab: React.Dispatch<
    React.SetStateAction<DashboardTabs | EventTabs>
  >;
}> = ({ tabs, setSelectedTab }) => {
  const menuColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Menu autoSelect={false}>
      <MenuButton as={IconButton} icon={<HamburgerIcon />} aria-label="menu" />
      <MenuList bgColor={menuColor}>
        {Object.values(tabs).map((value, index) => (
          <MenuItem
            key={index}
            onClick={() => setSelectedTab(value)}
            // {/* // icon={<BsFillCalendarEventFill />} */}
          >
            {value}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem onClick={() => signOut()} icon={<FiLogOut />}>
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
