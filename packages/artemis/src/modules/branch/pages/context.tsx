import { useQuery } from "@hooks/useQuery";
import { Branch } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";

const BranchContext = createContext(null);

export const BranchProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: branch } = useQuery<Branch>("/branches/" + router.query.slug);

  useEffect(() => console.log(branch), [branch]);

  return (
    <BranchContext.Provider value={{ branch }}>
      {branch && children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const branch = useContext<{ branch: Branch }>(BranchContext);
  return branch;
};
