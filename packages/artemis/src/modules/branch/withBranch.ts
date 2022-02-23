import { getAxios } from "@lib/axios";
import { Branch, BranchMember } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type ContextWithBranch = {
  branch: Branch;
  member: BranchMember;
  context: GetServerSidePropsContext;
};

export const withBranch = (
  gssp: (
    args: ContextWithBranch,
  ) => GetServerSidePropsResult<
    { branch: Branch; member: BranchMember } & Record<string, any>
  > = ({ branch, member }) => ({
    props: { branch, member },
  }),
) => {
  return async (context: GetServerSidePropsContext) => {
    const axios = await getAxios(context.req, true);
    const branch = await axios.get<Branch>("/branches/" + context.params.slug);

    let member = await axios.get<BranchMember>(
      `/users/branch/${branch.data.id}`,
    );

    if (!member.data) {
      member = await axios.post("/branches/join", { branchId: branch.data.id });
    }

    return gssp({ branch: branch.data, member: member.data, context });
  };
};
