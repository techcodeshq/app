import { Perm } from "@prisma/client";
import { Server } from "socket.io";
import { prisma } from "../util/prisma";

export const permissionGateway = (io: Server) => {
  const permissions = io.of("/permissions");

  permissions.on("connection", (socket) => {
    socket.on(
      "permission_query",
      async (
        {
          branchId,
          sessionToken,
          requiredPerms,
        }: { branchId: string; sessionToken: string; requiredPerms: Perm[] },
        callback,
      ) => {
        if (!sessionToken || !branchId) return callback({ allowed: false });

        const { user } = (await prisma.session.findUnique({
          where: { sessionToken },
          include: { user: true },
        }))!;
        if (user.isIncredible) return callback({ allowed: true });

        const branchMember = await prisma.branchMember.findUnique({
          where: {
            userId_branchId: {
              userId: user.id,
              branchId,
            },
          },
          select: { roles: { select: { perms: true } } },
        });

        if (!branchMember) return callback({ allowed: false });

        const perms = new Set<Perm>();
        for (const role of branchMember.roles) {
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

        if (
          requiredPerms?.every((perm) => perms.has(perm)) ||
          perms.has(Perm.MANAGE_BRANCH)
        ) {
          return callback({ allowed: true });
        }

        return callback({ allowed: false });
      },
    );
  });

  return permissions;
};
