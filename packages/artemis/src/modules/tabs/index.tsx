import { ComponentWithAs, IconProps } from "@chakra-ui/react";
import { Perm } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { IconType } from "react-icons";

const TabContext = createContext(null);

export interface Tab {
  name: string;
  route: string;
  icon: IconType | ComponentWithAs<"svg", IconProps>;
  query?: Record<string, string>;
  perms?: Perm[];
}

export const Tabs: React.FC<{ tabs: Tab[] }> = ({ children, tabs }) => {
  return <TabContext.Provider value={tabs}>{children}</TabContext.Provider>;
};

export const useTabs = () => {
  const tabs = useContext<Tab[]>(TabContext);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const router = useRouter();

  useEffect(() => {
    setSelectedTab(tabs.find((tab) => tab.route === router.pathname));
  }, [router]);

  return { tabs, selectedTab };
};
