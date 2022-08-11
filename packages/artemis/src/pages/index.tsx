import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";

const Index = () => {
  const logoColor = useColorModeValue("/text-logo-dark.svg", "/text-logo.svg");

  return (
    <Center height="100vh">
      <Box
        border="3px solid #222A34"
        width={{ base: 400, md: 500, lg: 550 }}
        height={{ base: 500, md: 625, lg: 687.5 }}
        borderRadius={25}
      >
        <Flex
          h="100%"
          direction="column"
          alignItems="center"
          justifyContent="space-around"
        >
          <Flex direction="column" alignItems="center">
            <Image src={logoColor} width="85%" alt="" />
            <Text
              fontSize="3rem"
              fontWeight="bold"
              marginRight="7.5%"
              marginLeft="auto"
            >
              (the App)
            </Text>
          </Flex>

          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl: `/register?${new URLSearchParams({
                  url: window.location.href,
                })}`,
              })
            }
            fontSize="2.3rem"
            borderRadius={25}
            w="40%"
            h="9%"
          >
            Sign In
          </Button>
          <Link href="https://www.techcodes.org" target="_blank" _focus={{}}>
            Visit our website!
          </Link>
        </Flex>
      </Box>
    </Center>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session)
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };

  return { props: {} };
};

export default Index;
