import { prisma } from "./prisma";

export const generateSlug = async (
  entity: "branch" | "event",
  name: string,
) => {
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const events = await (prisma[entity] as any).findMany({ where: { slug } });

  if (events.length > 0) {
    return slug + events.length;
  }

  return slug;
};
