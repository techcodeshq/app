import { useBreakpointValue } from "@chakra-ui/react";

export const useIsMobile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile;
};
