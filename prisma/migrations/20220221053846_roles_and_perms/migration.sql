/*
  Warnings:

  - Added the required column `isIncredible` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Perm" AS ENUM ('VIEW_USER', 'VIEW_EVENT_LINK', 'VIEW_EVENT_TASK', 'MANAGE_USER', 'MANAGE_EVENT', 'MANAGE_EVENT_LINK', 'MANAGE_EVENT_TASK', 'MANAGE_BRANCH');

-- AlterEnum
ALTER TYPE "AuditLogEntity" ADD VALUE 'BRANCH';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isIncredible" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "perms" "Perm"[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchMemberToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BranchMemberToRole_AB_unique" ON "_BranchMemberToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchMemberToRole_B_index" ON "_BranchMemberToRole"("B");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchMemberToRole" ADD FOREIGN KEY ("A") REFERENCES "BranchMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchMemberToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
