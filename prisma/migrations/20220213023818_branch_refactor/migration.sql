/*
  Warnings:

  - You are about to drop the column `userId` on the `EventLinkRedeem` table. All the data in the column will be lost.
  - You are about to drop the column `osis` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserMetadata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId,eventLinkId]` on the table `EventLinkRedeem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key,memberId]` on the table `UserMetadata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `EventLinkRedeem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `UserMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_userId_fkey";

-- DropIndex
DROP INDEX "EventLinkRedeem_userId_eventLinkId_key";

-- DropIndex
DROP INDEX "User_osis_key";

-- DropIndex
DROP INDEX "UserMetadata_key_userId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "branchId" TEXT;

-- AlterTable
ALTER TABLE "EventLinkRedeem" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "osis",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "UserMetadata" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "BranchMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchMember_userId_branchId_key" ON "BranchMember"("userId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "EventLinkRedeem_memberId_eventLinkId_key" ON "EventLinkRedeem"("memberId", "eventLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_key_memberId_key" ON "UserMetadata"("key", "memberId");

-- AddForeignKey
ALTER TABLE "BranchMember" ADD CONSTRAINT "BranchMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchMember" ADD CONSTRAINT "BranchMember_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "BranchMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "BranchMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
