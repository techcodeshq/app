import { Branch } from "@prisma/client";
import { createContext, useContext } from "react";

const BranchContext = createContext(null);

export const BranchProvider: React.FC<{ branch: Branch }> = ({
  branch,
  children,
}) => {
  return (
    <BranchContext.Provider value={{ branch }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const branch = useContext<{ branch: Branch }>(BranchContext);
  return branch;
};
