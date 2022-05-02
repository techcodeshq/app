import { DashboardLayout } from "../dashboard/layout";
import { TabHeading } from "@ui/tab-heading";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { RoleSettings } from "./role-settings";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { SettingsAccordionLayout } from "./layout";

export const DashboardSettingsView: React.FC = () => {
  const { data: session } = useSession({ required: false });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const itemBgColor = useColorModeValue("bg.100", "bg.700");
  const changeOsis = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch",
  );

  return (
    <DashboardLayout>
      <TabHeading heading="Settings" />

      <Box width="90%" m="0 auto" bgColor={bgColor}>
        {/* Account info box */}
        <Box p="1rem 0" bgColor={itemBgColor} mt="2rem" mb="4rem">
          <Flex p="0 1.5rem" justifyContent="space-between" alignItems="center">
            <Box>
              <Heading fontWeight="500" fontSize="1.8rem" pb="2">
                Account Info
              </Heading>
              {session && (
                <Stack
                  gap="1rem"
                  fontSize="1.1rem"
                  direction={{ base: "column", md: "row" }}
                >
                  <Text>Name: {session.user.name}</Text>
                  <Text>Email: {session.user.email}</Text>
                </Stack>
              )}
            </Box>
            {!isMobile && session && (
              <Avatar src={session.user.image} size="lg" />
            )}
          </Flex>
        </Box>

        <SettingsAccordionLayout
          sections={[
            {
              name: "Roles",
              perms: ["MANAGE_ROLES"],
              component: RoleSettings,
            },
          ]}
        />
      </Box>
    </DashboardLayout>
  );
};
