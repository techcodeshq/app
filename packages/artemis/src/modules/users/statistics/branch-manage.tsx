import {
  Flex,
  Heading,
  useBreakpointValue,
  Text,
  Box,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { BranchLayout } from "@modules/branch/pages/layout";
import { BranchMember, User } from "@prisma/client";
import { useRouter } from "next/router";
import { MemberData } from "./data";
import { MemberDataMobile } from "./data-mobile";
import { Query } from "./query";

export const BranchManagerStatisticsView: React.FC = () => {
  const router = useRouter();
  const { data } = useQuery<Query>(`/members/${router.query.id}/metadata`);
  const { data: member } = useQuery<BranchMember & { user: User }>(
    `/members/user/${router.query.id}`,
  );
  const largeScreen = useBreakpointValue({ base: false, md: true });

  return (
    <BranchLayout>
      {member && (
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <Heading fontSize="2rem" fontWeight="medium">
              {member.user.name}
            </Heading>
            <Text opacity="70%">{member.user.email}</Text>
          </Box>
          <Avatar src={member.user.image} />
        </Flex>
      )}
      {data && largeScreen && (
        <Flex h="100%" gap="1rem" mt="1rem">
          <MemberData data={data} />
        </Flex>
      )}
      {data && !largeScreen && (
        <>
          <Divider m="0.5rem 0" />
          <MemberDataMobile data={data} />
        </>
      )}
    </BranchLayout>
  );
};
