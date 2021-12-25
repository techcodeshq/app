import { Box } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import React from "react";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  return <Box>Register</Box>;
};

export const getServerSideProps = async (context) => {
  const { user } = await getSession(context);

  if (!user.osis) return { props: { user: user } };
  return {
    redirect: {
      destination: context.query.callback || "/dashboard",
      permanent: false,
    },
  };
};

export default Register;
