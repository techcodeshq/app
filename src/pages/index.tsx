import { Box, Button } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

const Index = () => {
  const { data: session } = useSession();

  return (
    <Box>
      <Button onClick={() => (!session ? signIn("google") : signOut())}>
        {session ? "Sign Out" : "Sign In"}
      </Button>
    </Box>
  );
};

export default Index;
