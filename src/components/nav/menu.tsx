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
import React from "react";
import { BsFillCalendarEventFill, BsFillPersonLinesFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { DashboardTabs, useDashboard } from "../dashboard/context";

export const NavMenu: React.FC = () => {
  const menuColor = useColorModeValue("bg.100", "bg.800");
  const { setSelectedTab } = useDashboard();

  return (
    <Menu>
      <MenuButton as={IconButton} icon={<HamburgerIcon />} aria-label="menu" />
      <MenuList bgColor={menuColor}>
        <MenuItem
          onClick={() => setSelectedTab(DashboardTabs.MEMBERS)}
          icon={<BsFillPersonLinesFill />}
        >
          Members
        </MenuItem>
        <MenuItem
          onClick={() => setSelectedTab(DashboardTabs.EVENTS)}
          icon={<BsFillCalendarEventFill />}
        >
          Events
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => setSelectedTab(DashboardTabs.EVENTS)}
          icon={<FiLogOut />}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
