import { Role, User } from "@prisma/client";
import { Middleware, Response } from "typera-express";
import { prisma } from "../util/prisma";

export const authenticated: Middleware.Middleware<
    { user: User },
    Response.Unauthorized<{ error: string; description: string }>
> = async ({ req }) => {
    const { headers } = req;
    const sessionToken = headers["session-token"] as string;
    if (!sessionToken) {
        return Middleware.stop(
            Response.unauthorized({
                error: "SESSION_NOT_FOUND",
                description: "You must be logged in to access this route",
            })
        );
    }

    const sessionAndUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
    });

    if (!sessionAndUser) {
        return Middleware.stop(
            Response.unauthorized({
                error: "USER_NOT_FOUND",
                description: "No user found associated to this session",
            })
        );
    }

    return Middleware.next({ user: sessionAndUser.user });
};

export const authorized = (roles: Role[]) => {
    const middleware: Middleware.ChainedMiddleware<
        { user: User },
        unknown,
        Response.Unauthorized<{ error: string; description: string }>
    > = ({ user }) => {
        if (!user) {
            return Middleware.stop(
                Response.unauthorized({
                    error: "USER_NOT_FOUND",
                    description: "No user found associated to this session",
                })
            );
        }

        if (!roles.includes(user.role)) {
            return Middleware.stop(
                Response.unauthorized({
                    error: "UNAUTHORIZED",
                    description:
                        "Authenticated user does not have required role",
                })
            );
        }

        return Middleware.next();
    };

    return middleware;
};
