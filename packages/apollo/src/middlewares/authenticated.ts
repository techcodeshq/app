import { Role, User } from "@prisma/client";
import { Middleware, Response } from "typera-express";
import { prisma } from "../util/prisma";
import { RouteError } from "../util/error";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const authenticated: Middleware.Middleware<
  { user: User },
  Response.Unauthorized<RouteError>
> = async ({ req }) => {
  const res = await authenticatedInner(req);
  if ("error" in res) {
    return Middleware.stop(Response.unauthorized(res));
  } else {
    return Middleware.next(res);
  }
};

export const authorized = (roles: Role[]) => {
  const middleware: Middleware.ChainedMiddleware<
    { user: User },
    unknown,
    Response.Unauthorized<RouteError>
  > = ({ user }) => {
    const error = authorizedInner(roles, user);

    if (error) {
      return Middleware.stop(Response.unauthorized(error));
    } else {
      return Middleware.next();
    }
  };

  return middleware;
};

export const wsAuthenticated = async (socket: any, next: any) => {
  const res = await authenticatedInner(socket.request);
  if ("error" in res) {
    next(new Error(res.description));
  } else {
    next(res);
  }
};

const authenticatedInner = async (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
): Promise<{ user: User } | RouteError> => {
  const { headers } = req;
  const sessionToken = headers.authorization;

  if (!sessionToken) {
    return {
      error: "SESSION_NOT_FOUND",
      description: "You must be logged in to access this route",
    };
  }

  const sessionAndUser = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!sessionAndUser) {
    return {
      error: "USER_NOT_FOUND",
      description: "No user found associated to this session",
    };
  }

  return { user: sessionAndUser.user };
};

const authorizedInner = (roles: Role[], user: User): RouteError | null => {
  if (!user) {
    return {
      error: "USER_NOT_FOUND",
      description: "No user found associated to this session",
    };
  }

  if (!roles.includes(user.role)) {
    return {
      error: "UNAUTHORIZED",
      description: "Authenticated user does not have required role",
    };
  }

  return null;
};
