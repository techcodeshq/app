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

    const userWithRoles = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        roles: true,
      },
    });

    const perms = new Set<Perm>();
    for (const role of userWithRoles?.roles || []) {
      for (const perm of role.perms) {
        perms.add(perm);
        if (perm.startsWith("MANAGE")) {
          const viewPerm = perm.replace("MANAGE", "VIEW");
          if (Object.values(Perm).includes(viewPerm as Perm)) {
            perms.add(viewPerm as Perm);
          }
        }
      }
    }

    if (requiredPerms.every((perm) => perms.has(perm))) {
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
