/*
  Warnings:

  - The values [VIEW_USER,MANAGE_USER,MANAGE_ROLE] on the enum `Perm` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Perm_new" AS ENUM ('VIEW_MEMBER', 'VIEW_EVENT_LINK', 'VIEW_EVENT_TASK', 'VIEW_AUDIT_LOG', 'MANAGE_MEMBER', 'MANAGE_EVENT', 'MANAGE_EVENT_LINK', 'MANAGE_EVENT_TASK', 'MANAGE_BRANCH');
ALTER TABLE "Role" ALTER COLUMN "perms" TYPE "Perm_new"[] USING ("perms"::text::"Perm_new"[]);
ALTER TYPE "Perm" RENAME TO "Perm_old";
ALTER TYPE "Perm_new" RENAME TO "Perm";
DROP TYPE "Perm_old";
COMMIT;
