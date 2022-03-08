import {
  Avatar,
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Layout } from "@components/layout";
import { useQuery } from "@hooks/useQuery";
import { AuditLogAction, AuditLogEntry, User } from "@prisma/client";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@ui/sidebar";
import moment from "moment";
import { BiEditAlt, BiMinus } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";

export default () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const { data } = useQuery<
    (AuditLogEntry & {
      author: User;
    })[]
  >("/audit");

  return (
    <Layout title="Audit Log">
      {isMobile ? (
        <Topbar>
          <TopbarLeft />
          <TopbarRight />
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarBottom />
        </Sidebar>
      )}
      <Box>
        <Flex flexDir="column" gap="1rem">
          <Heading fontWeight="regular">Audit Log</Heading>
          {data &&
            data.map((audit) => (
              <Flex
                p="1rem 2rem"
                bgColor={bgColor}
                borderRadius="0.4rem"
                alignItems="center"
                justifyContent="space-between"
                shadow="sm"
                _hover={{ cursor: "pointer" }}
                key={audit.id}
              >
                <Flex alignItems="center" gap="1rem">
                  <Avatar src={audit.author.image} />
                  <Box>
                    <Text>
                      {audit.author.name} - {audit.description}
                    </Text>
                    <Text color="text.300">
                      {moment(audit.createdAt).calendar()}
                    </Text>
                  </Box>
                </Flex>
                {audit.action === AuditLogAction.CREATE ? (
                  <BsPlusLg />
                ) : audit.action === AuditLogAction.DELETE ? (
                  <BiMinus />
                ) : (
                  <BiEditAlt />
                )}
              </Flex>
            ))}
        </Flex>
      </Box>
    </Layout>
  );
};
