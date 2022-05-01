import { Perm } from "@prisma/client";
import { Server } from "socket.io";
import { prisma } from "../util/prisma";

type Body = {
  sessionToken: string;
  requiredPerms?: Perm[];
  requireIncredible?: boolean;
};

export const permissionGateway = (io: Server) => {
  const permissions = io.of("/permissions");

  permissions.on("connection", (socket) => {
    socket.on(
      "permission_query",
      async (
        { sessionToken, requiredPerms, requireIncredible = false }: Body,
        callback,
      ) => {
        if (requiredPerms?.length === 0 && !requireIncredible) {
          return callback({ allowed: true });
        }
        if (!sessionToken) return callback({ allowed: false });

        const { user } = (await prisma.session.findUnique({
          where: { sessionToken },
          include: {
            user: {
              select: {
                isIncredible: true,
                roles: true,
              },
            },
          },
        })) ?? { user: null };

        if (!user) return callback({ allowed: false });
        if (user.isIncredible) return callback({ allowed: true });

        const perms = new Set<Perm>();
        for (const role of user.roles) {
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

        if (requiredPerms?.every((perm) => perms.has(perm))) {
          return callback({ allowed: true });
        }

        return callback({ allowed: false });
      },
    );
  });

  return permissions;
};
