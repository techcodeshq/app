import { User, Prisma, Perm } from "@prisma/client";
import { Middleware, Response } from "typera-express";
import { prisma } from "../util/prisma";
import { RouteError } from "../util/error";

export const authenticated = (userIncludes: Prisma.UserInclude | null) => {
  const middleware: Middleware.Middleware<
    { user: User & any },
    Response.Unauthorized<RouteError>
  > = async ({ req }) => {
    const { headers } = req;
    const sessionToken = headers.authorization;

    if (!sessionToken) {
      return Middleware.stop(
        Response.unauthorized({
          error: "SESSION_NOT_FOUND",
          description: "You must be logged in to access this route",
        }),
      );
    }

    const sessionAndUser = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: userIncludes ? { include: userIncludes } : true },
    });

    if (!sessionAndUser) {
      return Middleware.stop(
        Response.unauthorized({
          error: "USER_NOT_FOUND",
          description: "No user found associated to this session",
        }),
      );
    }

    return Middleware.next({ user: sessionAndUser.user });
  };

  return middleware;
};

export const authorized = (...requiredPerms: Perm[]) => {
  const middleware: Middleware.ChainedMiddleware<
    { user: User },
    unknown,
    Response.Unauthorized<RouteError>
  > = async ({ user, req }) => {
    if (user.isIncredible) {
      return Middleware.next();
    }

    const branchId = req.header("branchId");

    if (!branchId) {
      return Middleware.stop(
        Response.unauthorized({
          error: "MISSING_BRANCH_HEADER",
          description: "A header with the branch id was required but not found",
        }),
      );
    }
    const branchMember = await prisma.branchMember.findUnique({
      where: { userId_branchId: { userId: user.id, branchId } },
      include: { roles: true },
    });

    if (!branchMember) {
      return Middleware.stop(
        Response.unauthorized({
          error: "NOT_IN_BRANCH",
          description:
            "You are not in the branch that was specified in the header!",
        }),
      );
    }

    const perms = new Set<Perm>();
    for (const role of branchMember.roles) {
      for (const perm of role.perms) {
        perms.add(perm);
        if (perm.startsWith("MANAGE")) {
          const view_perm = perm.replace("MANAGE", "VIEW");
          if (view_perm in Object.values(Perm)) {
            perms.add(view_perm as Perm);
          }
        }
      }
    }

    if (
      requiredPerms.every((perm) => perm in perms) ||
      Perm.MANAGE_BRANCH in perms
    ) {
      return Middleware.next();
    } else {
      return Middleware.stop(
        Response.unauthorized({
          error: "NOT_PERMITTED",
          description: "You don't have permission to do that!",
        }),
      );
    }
  };

  return middleware;
};

export const incredible: Middleware.ChainedMiddleware<
  { user: User },
  unknown,
  Response.Unauthorized<RouteError>
> = ({ user }) => {
  if (!user.isIncredible) {
    return Middleware.stop(
      Response.unauthorized({
        error: "NOT_INCREDIBLE_ENOUGH",
        description: "You are not incredible enough to do that",
      }),
    );
  }

  return Middleware.next();
};
