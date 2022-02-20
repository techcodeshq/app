import { Layout } from "@components/event/executive/layout";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { InferGetServerSidePropsType, NextPage } from "next";
import { Session } from "next-auth";
import { Event } from "@prisma/client";
import { LinksTab } from "@components/event/executive/links-tab";
import { useDisclosure } from "@chakra-ui/react";
import { withEvent } from "src/modules/event/withEvent";

interface LinksPageProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Links: NextPage<LinksPageProps> = ({ session, slug, fallback }) => {
  const linkCreate = useDisclosure();

  return (
    <Layout
      session={session}
      slug={slug}
      fallback={fallback}
      linkCreate={linkCreate}
    >
      <LinksTab linkCreate={linkCreate} />
    </Layout>
  );
};

export const getServerSideProps = withEvent();

export default Links;
