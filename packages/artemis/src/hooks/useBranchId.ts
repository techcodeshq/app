import { useBranch } from "@modules/branch/pages/context";
import { useEvent } from "@modules/event/pages/context";

export const useBranchId = () => {
  const branchData = useBranch();
  const eventData = useEvent();

  if (branchData) return branchData.branch.id;
  if (eventData) return eventData.event.branchId;

  return "";
};
