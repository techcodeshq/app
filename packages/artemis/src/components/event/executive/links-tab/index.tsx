import { UseDisclosureReturn } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { CreateLink } from "./create-link";
import { LinksGrid } from "./links-grid";

interface LinksTabProps {
  linkCreate: UseDisclosureReturn;
}

export const LinksTab: React.FC<LinksTabProps> = ({ linkCreate }) => {
  const { isOpen, onClose } = linkCreate;

  return (
    <>
      <LinksGrid />
      <CreateLink isOpen={isOpen} onClose={onClose} />
    </>
  );
};
