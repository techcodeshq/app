import { getAxios } from "@lib/axios";
import { Branch } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type ContextWithBranch = {
  branch: Branch;
  context: GetServerSidePropsContext;
};

export const withBranch = (
  gssp: (
    args: ContextWithBranch,
  ) => GetServerSidePropsResult<{ branch: Branch } & Record<string, any>> = ({
    branch,
  }) => ({
    props: { branch },
  }),
) => {
  return async (context: GetServerSidePropsContext) => {
    const axios = await getAxios(context.req, false);
    const res = await axios.get<Branch>("/branch/" + context.params.slug);

    return gssp({ branch: res.data, context });
  };
};
