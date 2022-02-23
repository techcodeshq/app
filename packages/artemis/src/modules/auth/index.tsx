import { Box, Button, Heading } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import React from "react";

export const Auth: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  if (status == "loading") {
    return null;
  }

  if (isUser) {
    return <>{children}</>;
  }

  return (
    <React.Fragment>
      <Box
        position="absolute"
        h="100vh"
        w="100vw"
        zIndex={10}
        bg="rgba(17, 25, 40, 0.70)"
        backdropFilter="blur(16px) saturate(180%)"
      >
        <Box
          display="flex"
          flexDir="column"
          justifyContent="space-between"
          position="absolute"
          left="50%"
          top="50%"
          gap="1rem"
          bgColor="rgba(17, 25, 40, 0.75)"
          border="0.0625rem solid rgba(255, 255, 255, 0.125)"
          backdropFilter="blur(16px) saturate(180%)"
          borderRadius="0.75rem"
          p="2rem"
          minW="45vmax"
          transform="translate(-50%, -50%)"
        >
          <Heading fontWeight="medium" fontSize="min(1.9vmax, 2rem)">
            Hey! It seems you aren't signed in!
          </Heading>
          <Button onClick={() => signIn("google")} w="6rem">
            Sign In
          </Button>
        </Box>
      </Box>
      {children}
    </React.Fragment>
  );

  // return (Component: React.FC | NextPage) => {
  //   const session = await getSession(context);

  //   if (requireAuth && !session) {
  //     return {
  //       redirect: {
  //         destination: `/auth/signin/?${new URLSearchParams({
  //           callback: context.resolvedUrl,
  //         })}`,
  //         permanent: false,
  //       },
  //     };
  //   }

  //   return { props: { user: session.user } };
  // };
};
