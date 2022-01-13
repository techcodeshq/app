import { ExecutiveDashboardView } from "@components/dashboard/executive";
import { MemberDashboardView } from "@components/dashboard/member";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role, User } from "@typings";
import { Session } from "next-auth";
import React from "react";

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  switch (session.user.role) {
    case Role.EXEC:
      return <ExecutiveDashboardView />;
    case Role.MEMBER:
      return (
        <MemberDashboardView
          route="/users/metadata"
          user={session.user as User}
        />
      );
  }
};

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return { props: { session } };
});

export default Dashboard;
