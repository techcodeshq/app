import { useBreakpointValue, UseDisclosureReturn } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { CreateLink } from "./create-link";
import { LinksGrid } from "./links-grid";
import { LinksList } from "./links-list";

interface LinksTabProps {
  linkCreate: UseDisclosureReturn;
}

export const LinksTab: React.FC<LinksTabProps> = ({ linkCreate }) => {
  const { isOpen, onClose } = linkCreate;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {!isMobile ? <LinksGrid /> : <LinksList />}
      <CreateLink isOpen={isOpen} onClose={onClose} />
    </>
  );
};
