import { DeleteIcon } from "@chakra-ui/icons";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { TooltipButton, TooltipButtonProps } from "src/ui/tooltip-button";
import { useMutation } from "@hooks/useMutation";
import React from "react";
import { ConfirmDelete } from "./delete-confirmation";

export interface DeleteItemProps {
  itemName: string;
  url: string;
  refetchUrl: string;
  warningText: string;
  iconColor?: string;
  deps?: any[];
  preDelete?: () => Promise<void>;
  postDelete?: () => Promise<void>;
  children: (onOpen: () => void) => React.ReactNode;
}

export const DeleteItem: React.FC<DeleteItemProps> = ({
  url,
  refetchUrl,
  itemName,
  warningText,
  iconColor,
  deps,
  preDelete,
  postDelete,
  children,
}) => {
  const deleteItem = useMutation<any, any>(
    url,
    "delete",
    refetchUrl,
    deps ? deps : [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {typeof children === "function" ? children(onOpen) : null}

      <ConfirmDelete
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={deleteItem as any}
        confirmKey={itemName}
        warningText={warningText}
        preDelete={preDelete}
        postDelete={postDelete}
      />
    </>
  );
};
