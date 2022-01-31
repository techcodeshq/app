import {
  Flex,
  Menu,
  MenuItem,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { ChatMessage } from "@prisma/client";
import { useState } from "react";
import { BsTrashFill } from "react-icons/bs";

export const ContextMenu: React.FC<{
  control: UseDisclosureReturn;
  params: { id: string; page: number };
}> = ({ control, params }) => {
  const { isOpen, onClose } = control;
  const bgColor = useColorModeValue("bg.200", "bg.700");
  const deleteMessage = useMutation<ChatMessage, { messageId: string }>(
    `/chat/${params?.id}?page=${params?.page}`,
    "delete",
    "",
    [params],
  );
  const [loading, setLoading] = useState(false);

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuList shadow="md" bgColor={bgColor}>
        <MenuItem
          icon={<BsTrashFill />}
          onClick={async () => {
            setLoading(true);
            await deleteMessage({ messageId: params?.id });
            setLoading(false);
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Delete</Text>
            {loading && <Spinner size="sm" />}
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
