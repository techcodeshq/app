import { MemberDashboardView } from "@components/dashboard/member";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";
import { useRouter } from "next/router";
import React from "react";

interface UserPageProps {}

const UserInfoPage: React.FC<UserPageProps> = ({}) => {
  const router = useRouter();

  return <MemberDashboardView route={`/users/metadata/${router.query.id}`} />;
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

export default UserInfoPage;
