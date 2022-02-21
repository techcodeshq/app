import { UseDisclosureReturn } from "@chakra-ui/react";
import { Branch } from "@prisma/client";
import { createContext, useContext } from "react";
import { BranchSettings } from "../settings";

const BranchContext = createContext(null);

export const BranchProvider: React.FC<{
  branch: Branch;
  branchSettings: UseDisclosureReturn;
}> = ({ branch, children, branchSettings }) => {
  return (
    <BranchContext.Provider value={{ branch }}>
      {children}
      <BranchSettings control={branchSettings} />
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const branch = useContext<{ branch: Branch }>(BranchContext);
  return branch;
};
