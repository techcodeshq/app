import { UseDisclosureReturn } from "@chakra-ui/react";
import { Branch, BranchMember } from "@prisma/client";
import { createContext, useContext } from "react";
import { BranchSettings } from "../settings";

const BranchContext = createContext(null);

export const BranchProvider: React.FC<{
  branch: Branch;
  member: BranchMember;
  branchSettings: UseDisclosureReturn;
}> = ({ branch, children, branchSettings, member }) => {
  return (
    <BranchContext.Provider value={{ branch, member }}>
      {children}
      <BranchSettings control={branchSettings} />
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const branch =
    useContext<{ branch: Branch; member: BranchMember }>(BranchContext);
  return branch;
};
