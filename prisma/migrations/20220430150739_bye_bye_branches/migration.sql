/*
  Warnings:

  - The values [BRANCH] on the enum `AuditLogEntity` will be removed. If these variants are still used in the database, this will fail.
  - The values [VIEW_MEMBER,MANAGE_MEMBER,MANAGE_BRANCH] on the enum `Perm` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `branchId` on the `AuditLogEntry` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `EventLinkRedeem` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `UserMetadata` table. All the data in the column will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BranchMemberToRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,eventLinkId]` on the table `EventLinkRedeem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key,userId]` on the table `UserMetadata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `EventLinkRedeem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditLogEntity_new" AS ENUM ('USER', 'USER_METADATA', 'EVENT', 'EVENT_LINK', 'EVENT_LINK_REDEEM', 'EVENT_TASK');
ALTER TABLE "AuditLogEntry" ALTER COLUMN "entity" TYPE "AuditLogEntity_new" USING ("entity"::text::"AuditLogEntity_new");
ALTER TYPE "AuditLogEntity" RENAME TO "AuditLogEntity_old";
ALTER TYPE "AuditLogEntity_new" RENAME TO "AuditLogEntity";
DROP TYPE "AuditLogEntity_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Perm_new" AS ENUM ('VIEW_EVENT_LINK', 'VIEW_EVENT_TASK', 'VIEW_AUDIT_LOG', 'MANAGE_EVENT', 'MANAGE_EVENT_LINK', 'MANAGE_EVENT_TASK');
ALTER TABLE "Role" ALTER COLUMN "perms" TYPE "Perm_new"[] USING ("perms"::text::"Perm_new"[]);
ALTER TYPE "Perm" RENAME TO "Perm_old";
ALTER TYPE "Perm_new" RENAME TO "Perm";
DROP TYPE "Perm_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AuditLogEntry" DROP CONSTRAINT "AuditLogEntry_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchMember" DROP CONSTRAINT "BranchMember_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchMember" DROP CONSTRAINT "BranchMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_branchId_fkey";

-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_branchId_fkey";

-- DropForeignKey
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_memberId_fkey";

-- DropForeignKey
ALTER TABLE "_BranchMemberToRole" DROP CONSTRAINT "_BranchMemberToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchMemberToRole" DROP CONSTRAINT "_BranchMemberToRole_B_fkey";

-- DropIndex
DROP INDEX "EventLinkRedeem_memberId_eventLinkId_key";

-- DropIndex
DROP INDEX "UserMetadata_key_memberId_key";

-- AlterTable
ALTER TABLE "AuditLogEntry" DROP COLUMN "branchId";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "branchId";

-- AlterTable
ALTER TABLE "EventLinkRedeem" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "branchId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "UserMetadata" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Branch";

-- DropTable
DROP TABLE "BranchMember";

-- DropTable
DROP TABLE "_BranchMemberToRole";

-- CreateIndex
CREATE UNIQUE INDEX "EventLinkRedeem_userId_eventLinkId_key" ON "EventLinkRedeem"("userId", "eventLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_key_userId_key" ON "UserMetadata"("key", "userId");

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- gilbert waz here manually editing migration.sql! :D
-- AlterEnum
ALTER TYPE "Perm" ADD VALUE 'MANAGE_ROLES';

-- AlterEnum
ALTER TYPE "Perm" ADD VALUE 'MANAGE_USERS';

-- AlterEnum
ALTER TYPE "Perm" ADD VALUE 'VIEW_USER';
