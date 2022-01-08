import { MemberDashboardView } from "@components/dashboard/member";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role, User } from "@typings";
import { useRouter } from "next/router";
import React from "react";

interface UserPageProps {
  user: User;
}

const UserInfoPage: React.FC<UserPageProps> = ({ user }) => {
  const router = useRouter();

  return (
    <MemberDashboardView
      route={`/users/metadata/${router.query.id}`}
      user={user}
      isExec={true}
    />
  );
};

export const getServerSideProps = withOsisRedirect(
  async ({ session, context }) => {
    if (session.user.role !== Role.EXEC)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    const axios = await getAxios(context.req);
    const { data: user } = await axios.get(`/users/${context.params.id}`);

    return { props: { user } };
  }
);

export default UserInfoPage;
