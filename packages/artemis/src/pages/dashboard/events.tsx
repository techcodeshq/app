import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { CreateEvent } from "@modules/event/create-event";

// TODO: this
export default () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>click me!</Button>
      <Text>someone plz fix this</Text>
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </>
  );
};
