import { Box } from "@chakra-ui/react";
import { ExecutiveDashboardView } from "@components/dashboard/executive";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";
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
      return <Box>hi</Box>;
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
