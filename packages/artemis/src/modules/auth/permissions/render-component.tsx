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
  const { data: session, status } = useSession();
  const { socket } = usePermissionSocket();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (
      !socket ||
      (!perms && !requireIncredible) ||
      !session ||
      status === "unauthenticated"
    )
      return;

    socket.emit(
      "permission_query",
      {
        sessionToken: session.user.sessionToken,
        requiredPerms: perms,
        requireIncredible,
      },
      ({ allowed }) => {
        setAllowed(allowed);
      },
    );
  }, [socket, session]);

  if (allowed || (!perms && !requireIncredible)) {
    return <>{typeof children === "function" ? children(allowed) : children}</>;
  }

  if (allowed !== null && !allowed) {
    if (redirectOnFail) {
      return <Error statusCode={404} />;
    }

    return <>{typeof children === "function" ? children(allowed) : null}</>;
  }

  return null;
};
