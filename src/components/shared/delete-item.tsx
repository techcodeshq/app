import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { ConfirmDelete } from "./delete-confirmation";

export const DeleteItem: React.FC<{
  confirmKey: string;
  url: string;
  refetchUrl: string;
  warningText: string;
}> = ({ url, refetchUrl, confirmKey, warningText }) => {
  const deleteItem = useMutation<any, any>(url, "delete", refetchUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = useColorModeValue("bg.100", "bg.800");

  return (
    <>
      <IconButton
        onClick={onOpen}
        bgColor="red.300"
        _hover={{ bgColor: "red.400" }}
        aria-label="delete"
        icon={<DeleteIcon color={color} />}
      />
      <ConfirmDelete
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={deleteItem as any}
        confirmKey={confirmKey}
        warningText={warningText}
      />
    </>
  );
};
