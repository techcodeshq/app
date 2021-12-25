import { Box, Button } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

const Index = ({ session }) => {
  return (
    <Box>
      <Button
        onClick={() =>
          !session
            ? signIn("google", {
                callbackUrl: `/auth/register?${new URLSearchParams({
                  url: window.location.href,
                })}`,
              })
            : signOut()
        }
      >
        {session ? "Sign Out" : "Sign In"}
      </Button>
      {session && JSON.stringify(session.user)}
    </Box>
  );
};

export { getServerSideProps } from "../lib/util/osisRedirect";

export default Index;
