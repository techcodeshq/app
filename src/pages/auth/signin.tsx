import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { signIn } from "next-auth/react";
import React from "react";

interface SignInProps {}

const SignIn: React.FC<SignInProps> = ({}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Center h="100vh" as={Stack}>
      <Box bgColor={bgColor} p="2rem" borderRadius="0.5rem">
        <Heading mb="1rem">Please sign in to access this page!</Heading>
        <Button
          onClick={() =>
            signIn("google", {
              callbackUrl: `/auth/register?${new URLSearchParams({
                callback: window.location.href,
              })}`,
            })
          }
        >
          Sign In
        </Button>
      </Box>
    </Center>
  );
};

export const getServerSideProps = withOsisRedirect(({ session, context }) => {
  if (session)
    return {
      redirect: {
        destination: context.query.callback || "/dashboard",
        permanent: false,
      },
    };

  return { props: {} };
});

export default SignIn;
