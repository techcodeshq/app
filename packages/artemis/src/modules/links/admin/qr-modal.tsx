import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { EventLink } from "@prisma/client";
import QRCode from "qrcode.react";

export const QRModal: React.FC<{
  control: UseDisclosureReturn;
  link: EventLink;
}> = ({ control, link }) => {
  const { isOpen, onClose } = control;
  const qrSize = useBreakpointValue({ base: 200, lg: 250 });
  const theme = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bgColor="bg.900">
        <ModalHeader>QR Code - {link.code}</ModalHeader>
        <ModalBody>
          <Center p="3rem">
            <QRCode
              value={window.location.href}
              size={qrSize}
              fgColor="white"
              bgColor={(theme as any).colors.bg["900"]}
            />
          </Center>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
