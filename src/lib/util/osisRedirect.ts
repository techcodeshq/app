import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) return { props: {} };
  if (session && !session.user.osis)
    return {
      redirect: {
        destination: `/auth/register?${new URLSearchParams({
          callback: context.resolvedUrl,
        })}`,
        permanent: false,
      },
    };

  return { props: { session } };
};
