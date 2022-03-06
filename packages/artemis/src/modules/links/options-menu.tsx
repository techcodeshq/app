import { useDisclosure } from "@chakra-ui/react";
import { ContextItem } from "@components/context-item";
import { ContextMenu } from "@components/context-menu";
import { DeleteItem } from "@components/delete-item";
import { BsTrash } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { useEvent } from "../event/pages/context";
import { CreateLink } from "./create-link";
import { GrantLink } from "./grant-link";
import { QueryLink } from "./query";

export const OptionsMenu: React.FC<{ link: QueryLink }> = ({ link }) => {
  const { event } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: linkIsOpen,
    onOpen: linkOnOpen,
    onClose: linkOnClose,
  } = useDisclosure();

  return (
    <>
      <ContextMenu>
        <ContextItem text="Grant" Icon={GiPayMoney} onClick={() => onOpen()} />
        <ContextItem
          text="Duplicate"
          Icon={FaRegCopy}
          onClick={() => linkOnOpen()}
        />
        <DeleteItem
          url={`/links/${link.id}`}
          itemName={link.name}
          refetchUrl={`/links/${event.id}`}
          warningText={
            "Are you sure you would like to delete this link? Only do this for links that were created accidentally and have no uses yet."
          }
        >
          {(onOpen) => (
            <ContextItem
              onClick={() => onOpen()}
              text="Delete"
              Icon={BsTrash}
            />
          )}
        </DeleteItem>
      </ContextMenu>
      <GrantLink isOpen={isOpen} onClose={onClose} link={link} />
      <CreateLink
        isOpen={linkIsOpen}
        onClose={linkOnClose}
        initialValues={{
          name: link.name,
          uses: link.uses?.toString(),
          actions: link.metadata.map((data) => ({
            key: data.key,
            value: data.value.toString(),
            action: data.action,
          })),
        }}
      />
    </>
  );
};
