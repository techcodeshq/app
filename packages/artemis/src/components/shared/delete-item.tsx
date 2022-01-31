import { DeleteIcon } from "@chakra-ui/icons";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {
  TooltipButton,
  TooltipButtonProps,
} from "@components/ui/tooltip-button";
import { useMutation } from "@hooks/useMutation";
import { ConfirmDelete } from "./delete-confirmation";

export interface DeleteItemProps extends Omit<TooltipButtonProps, "label"> {
  itemName: string;
  url: string;
  refetchUrl: string;
  warningText: string;
  iconColor?: string;
  deps?: any[];
  preDelete?: () => Promise<void>;
  postDelete?: () => Promise<void>;
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
  ...props
}) => {
  const deleteItem = useMutation<any, any>(
    url,
    "delete",
    refetchUrl,
    deps ? deps : []
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <TooltipButton
        onClick={onOpen}
        label={`Delete ${itemName}`}
        bgColor="red.300"
        _hover={{ bgColor: "red.400" }}
        icon={<DeleteIcon color={iconColor} />}
        placement="right"
        {...props}
      />
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
