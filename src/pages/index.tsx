import { Box, Button, Link } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";

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
      {session && <Link href="/dashboard">Dashboard</Link>}
    </Box>
  );
};

export { getServerSideProps } from "../lib/util/osisRedirect";

export default Index;
