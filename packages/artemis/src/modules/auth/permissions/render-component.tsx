import { useBranchId } from "@hooks/useBranchId";
import { Perm } from "@prisma/client";
import { useSession } from "next-auth/react";
import Error from "next/error";
import React, { useEffect, useState } from "react";
import { usePermissionSocket } from "./socket";

export const RenderIfAllowed: React.FC<{
  perms?: Perm[];
  isPage?: boolean;
  requireIncredible?: boolean;
  children: ((allowed: boolean) => React.ReactNode) | React.ReactNode;
}> = ({ perms, isPage: redirectOnFail, children, requireIncredible }) => {
  const { data: session } = useSession();
  const branchId = useBranchId();
  const { socket } = usePermissionSocket();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (
      !socket ||
      (!branchId && !requireIncredible) ||
      (!perms && !requireIncredible)
    )
      return;

    socket.emit(
      "permission_query",
      {
        sessionToken: session.user.sessionToken,
        branchId,
        requiredPerms: perms,
        requireIncredible,
      },
      ({ allowed }) => {
        setAllowed(allowed);
      },
    );
  }, [socket, session, branchId]);

  if (allowed || (!perms && !requireIncredible)) {
    return <>{typeof children === "function" ? children(allowed) : children}</>;
  }

  if (allowed !== null && !allowed && redirectOnFail) {
    return <Error statusCode={404} />;
  }

  if (!allowed) {
    return <>{typeof children === "function" ? children(allowed) : null}</>;
  }

  return null;
};
