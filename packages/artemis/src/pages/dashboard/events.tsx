import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { Auth } from "@modules/auth";
import { CreateEvent } from "@modules/event/create-event";
import { NextPage } from "next";

// TODO: this
const Events: NextPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Auth>
      <Button onClick={onOpen}>click me!</Button>
      <Text>someone plz fix this</Text>
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </Auth>
  );
};

export default Events;
