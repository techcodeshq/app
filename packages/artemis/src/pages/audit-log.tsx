import {
  Box,
  Text,
  Flex,
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import {
  Topbar,
  TopbarLeft,
  TopbarRight,
  Sidebar,
  SidebarTop,
  SidebarBottom,
} from "@components/nav/base-sidebar";
import { Layout } from "@components/shared/layout";
import { useQuery } from "@hooks/useQuery";
import { AuditLogAction, AuditLogEntry, Role, User } from "@prisma/client";
import moment from "moment";
import { BsPlusLg } from "react-icons/bs";
import { BiEditAlt, BiMinus } from "react-icons/bi";
import { withOsisRedirect } from "@lib/util/osisRedirect";

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

export const getServerSideProps = withOsisRedirect(async ({ session }) => {
  if (session.user.role !== Role.EXEC)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return { props: {} };
});
