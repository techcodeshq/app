import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export type ContextWithSession = {
  session: Session;
  context: GetServerSidePropsContext;
};

export const redirect = async ({ context }: ContextWithSession) => {
  return {
    redirect: {
      destination: `/auth/register?${new URLSearchParams({
        callback: context.resolvedUrl,
      })}`,
      permanent: false,
    },
  };
};

export const withOsisRedirect = (
  gssp: (args: ContextWithSession) => any = ({ session }) => ({
    props: { session },
  }),
) => {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);
    if (session && !session.user.osis) return redirect({ session, context });

    return gssp({ session, context });
  };
};
