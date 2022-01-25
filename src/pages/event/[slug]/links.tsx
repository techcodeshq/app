import { Layout } from "@components/event/executive/layout";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";
import { InferGetServerSidePropsType, NextPage } from "next";
import { Session } from "next-auth";
import { Event } from "@typings";
import { LinksTab } from "@components/event/executive/links-tab";
import { useDisclosure } from "@chakra-ui/react";

interface LinksPageProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Links: NextPage<LinksPageProps> = ({ session, slug, fallback }) => {
  const linkCreate = useDisclosure();

  return (
    <Layout session={session} slug={slug} fallback={fallback}>
      <LinksTab linkCreate={linkCreate} />
    </Layout>
  );
};

export const getServerSideProps = withOsisRedirect(
  async ({ session, context }) => {
    if (!session || session.user.role !== Role.EXEC) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { slug } = context.params;
    const axios = await getAxios(context.req);
    const event = await axios.get<Event>(`/events/${slug}`);

    return {
      props: {
        session,
        slug,
        fallback: event.data,
      },
    };
  },
);

export default Links;
