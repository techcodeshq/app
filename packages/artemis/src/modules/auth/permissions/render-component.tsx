import { useBranchId } from "@hooks/useBranchId";
import { Perm } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePermissionSocket } from "./socket";

export const RenderIfAllowed: React.FC<{ perms: Perm[] }> = ({
  perms,
  children,
}) => {
  const { data: session } = useSession();
  const branchId = useBranchId();
  const { socket } = usePermissionSocket();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      "permission_query",
      {
        sessionToken: session.user.sessionToken,
        branchId,
        perms,
      },
      ({ allowed }) => {
        setAllowed(allowed);
      },
    );
  }, []);

  if (!allowed) return null;
  return <>{children}</>;
};
