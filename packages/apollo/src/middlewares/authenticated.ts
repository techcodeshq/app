import { User, Prisma } from "@prisma/client";
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

// export const authorized = (roles: Role[]) => {
//   const middleware: Middleware.ChainedMiddleware<
//     { user: User },
//     unknown,
//     Response.Unauthorized<RouteError>
//   > = ({ user }) => {
//     const error = authorizedInner(roles, user);

//     if (error) {
//       return Middleware.stop(Response.unauthorized(error));
//     } else {
//       return Middleware.next();
//     }
//   };

//   return middleware;
// };

// const authorizedInner = (roles: Role[], user: User): RouteError | null => {
//   if (!user) {
//     return {
//       error: "USER_NOT_FOUND",
//       description: "No user found associated to this session",
//     };
//   }

//   if (!roles.includes(user.role)) {
//     return {
//       error: "UNAUTHORIZED",
//       description: "Authenticated user does not have required role",
//     };
//   }

//   return null;
// };
