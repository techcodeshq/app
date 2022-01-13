import { Box, Button, Link } from "@chakra-ui/react";
import { withOsisRedirect } from "@lib/util/osisRedirect";
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

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
});

export default Index;
