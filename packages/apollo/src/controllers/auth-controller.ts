import { AuditLogAction, AuditLogEntity, Role, User } from "@prisma/client";
import axios from "axios";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { authenticated } from "../middlewares/authenticated";
import { audit } from "../util/audit";
import { prisma } from "../util/prisma";

export module AuthController {
  const GOOGLE_USER_URL =
    "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
  const EXEC_ORGANIZATION = "techcodes.org";
  const NOT_UNIQUE_ERROR = "P2002";

  export const createUser = route
    .post("/user")
    .use(
      Parser.body(
        t.type({
          name: t.string,
          email: t.string,
          image: t.string,
          emailVerified: t.any,
          organization: t.string,
          accessToken: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const { accessToken, organization } = body;

      if (!(await verifyUser(accessToken))) {
        return Response.ok({
          error: "INVALID_TOKEN",
          description: "Invalid Access Token",
        });
      }

      delete (body as any).accessToken;
      delete (body as any).organization;

      const data = {
        ...body,
        role: organization === EXEC_ORGANIZATION ? Role.EXEC : Role.MEMBER,
      };

      const user = await prisma.user.create({ data });

      const existingUser = await prisma.currentUser.findUnique({
        where: { email: user.email! },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            metadata: {
              create: {
                key: "points",
                public: true,
                value: existingUser.points,
              },
            },
          },
        });

        await prisma.currentUser.delete({
          where: { email: user.email! },
        });
      }

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
    .use(authenticated)
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
        include: { user: true },
      });
      if (!userAndSession) return Response.ok({ error: "No session found" });

      const { user, ...session } = userAndSession;
      (user as User & { sessionToken: string }).sessionToken =
        session.sessionToken;
      return Response.ok({ user, session });
    });

  export const updateSession = route
    .patch("/session")
    .use(authenticated)
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
    .use(authenticated)
    .handler(async ({ routeParams }) => {
      const { sessionToken } = routeParams;
      const deleted = await prisma.session.delete({
        where: { sessionToken },
      });

      return Response.ok(deleted);
    });

  export const registerOsis = route
    .patch("/registerOsis")
    .use(authenticated)
    .use(Parser.body(t.type({ osis: t.string })))
    .handler(async ({ user: authenticatedUser, body }) => {
      try {
        const user = await prisma.user.update({
          where: { id: authenticatedUser.id },
          data: {
            osis: body.osis,
          },
        });

        await audit({
          action: AuditLogAction.UPDATE,
          entity: AuditLogEntity.USER,
          author: user,
          description: `${user.name} changed OSIS to ${user.osis}`,
        });
        return Response.ok(user);
      } catch (err: any) {
        if (err.code === NOT_UNIQUE_ERROR) {
          return Response.ok({
            error: "OSIS_ALREADY_EXISTS",
            description:
              "There is already an account registered with this OSIS number!",
          });
        }

        return Response.ok({ error: "ERROR", description: err.code });
      }
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
