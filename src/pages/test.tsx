import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

const Test: React.FC = ({}) => {
  const { data: session } = useSession();

  return <Box>{JSON.stringify(session)}</Box>;
};

export default Test;
