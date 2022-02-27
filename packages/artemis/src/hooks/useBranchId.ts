import { useBranch } from "@modules/branch/pages/context";
import { useEvent } from "@modules/event/pages/context";
import { useEffect, useState } from "react";

export const useBranchId = () => {
  const branchData = useBranch();
  const eventData = useEvent();
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    if (branchData?.branch) return setBranchId(branchData.branch.id);
    if (eventData?.event) return setBranchId(eventData.event.id);
  }, [branchData, eventData]);

  return branchId;
};
