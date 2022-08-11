import {
  AuditLogAction,
  AuditLogEntity,
  ClubMemberInfo,
  User,
} from "@prisma/client";
import axios from "axios";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { authenticated } from "../middlewares/authentication";
import { audit } from "../util/audit";
import { prisma } from "../util/prisma";

export module AuthController {
  const GOOGLE_USER_URL =
    "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";

  export const createUser = route
    .post("/user")
    .use(
      Parser.body(
        t.type({
          name: t.string,
          email: t.string,
          image: t.string,
          emailVerified: t.any,
          accessToken: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const { accessToken } = body;

      if (!(await verifyUser(accessToken))) {
        return Response.ok({
          error: "INVALID_TOKEN",
          description: "Invalid Access Token",
        });
      }

      delete (body as any).accessToken;

      const user = await prisma.user.create({ data: body });

      return Response.ok(user);
    });

  export const getUser = route.get("/user/:id").handler(async (request) => {
    const { id } = request.routeParams;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return Response.ok(user);
  });

  export const getUserByEmail = route
    .get("/user-email/:email")
    .handler(async (request) => {
      const { email } = request.routeParams;
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      return Response.ok(user);
    });

  export const getUserByAccount = route
    .get("/user-account/:provider/:providerAccountId")
    .handler(async (request) => {
      const { provider, providerAccountId } = request.routeParams;
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId },
        },
        select: { user: true },
      });

      return Response.ok(account?.user ?? { error: "failed" });
    });

  export const updateUser = route
    .patch("/user")
    .use(authenticated(null))
    .use(
      Parser.body(
        t.partial({
          id: t.string,
          name: t.string,
          email: t.string,
          image: t.string,
          emailVerified: t.any,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const { id } = body;
      delete (body as any).id;

      const user = await prisma.user.update({
        where: { id },
        data: body,
      });

      await audit({
        action: AuditLogAction.UPDATE,
        entity: AuditLogEntity.USER,
        author: user,
      });
      return Response.ok(user);
    });

  export const linkAccount = route
    .post("/linkAccount")
    .use(
      Parser.body(
        t.type({
          provider: t.string,
          type: t.string,
          providerAccountId: t.string,
          access_token: t.string,
          expires_at: t.number,
          scope: t.string,
          token_type: t.string,
          id_token: t.string,
          userId: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const { access_token: accessToken } = body;

      if (!(await verifyUser(accessToken))) {
        return Response.ok({
          error: "INVALID_TOKEN",
          description: "Invalid Access Token",
        });
      }

      const account = await prisma.account.create({
        data: body,
      });

      return Response.ok(account);
    });

  export const createSession = route
    .post("/session")
    .use(
      Parser.body(
        t.type({
          sessionToken: t.string,
          userId: t.string,
          expires: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const session = await prisma.session.create({
        data: body,
      });

      return Response.ok(session);
    });

  export const getSessionAndUser = route
    .get("/session/:sessionToken")
    .handler(async ({ routeParams }) => {
      const { sessionToken } = routeParams;
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            include: {
              clubMemberInfo: true,
            },
          },
        },
      });
      if (!userAndSession) return Response.ok({ error: "No session found" });

      const { user, ...session } = userAndSession;
      (
        user as User & { sessionToken: string; clubMemberInfo: ClubMemberInfo }
      ).sessionToken = session.sessionToken;
      return Response.ok({ user, session });
    });

  export const updateSession = route
    .patch("/session")
    .use(authenticated(null))
    .use(
      Parser.body(
        t.partial({
          sessionToken: t.string,
          expires: t.any,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const session = await prisma.session.update({
        where: { sessionToken: body.sessionToken },
        data: body,
      });

      return Response.ok(session);
    });

  export const deleteSession = route
    .delete("/session/:sessionToken")
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const { sessionToken } = routeParams;
      const deleted = await prisma.session.delete({
        where: { sessionToken },
      });

      return Response.ok(deleted);
    });

  const verifyUser = async (token: string): Promise<boolean> => {
    try {
      const result = await axios.get(GOOGLE_USER_URL + token);
      return !result.data.error;
    } catch (err) {
      return false;
    }
  };
}
