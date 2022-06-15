import { Center } from "@chakra-ui/react";
import { Auth } from "@modules/auth";
import { Register } from "@modules/auth/register";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

const RegisterPage: NextPage = () => {
  return (
    <Auth>
      <Center m="8">
        <Register />
      </Center>
    </Auth>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const session = await getSession({ req });

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // if the user doesnt have an osis assigned
  if (!session.user.osis) return { props: {} };

  return {
    redirect: {
      destination: (query.callback as string) || "/dashboard",
      permanent: false,
    },
  };
};

export default RegisterPage;
