/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `EventLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `EventLink` table. All the data in the column will be lost.
  - The primary key for the `EventLinkRedeem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `EventLinkRedeem` table. All the data in the column will be lost.
  - The primary key for the `EventTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `EventTask` table. All the data in the column will be lost.
  - The primary key for the `LinkApplyInstructions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `LinkApplyInstructions` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `UserMetadata` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the `EventsOnUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,eventLinkId]` on the table `EventLinkRedeem` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `EventLink` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `EventTask` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `eventLinkId` on table `LinkApplyInstructions` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `userId` on table `UserMetadata` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventLink" DROP CONSTRAINT "EventLink_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_eventLinkId_fkey";

-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventTask" DROP CONSTRAINT "EventTask_eventTaskId_fkey";

-- DropForeignKey
ALTER TABLE "EventsOnUser" DROP CONSTRAINT "EventsOnUser_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventsOnUser" DROP CONSTRAINT "EventsOnUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "LinkApplyInstructions" DROP CONSTRAINT "LinkApplyInstructions_eventLinkId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EventLink" DROP CONSTRAINT "EventLink_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "EventLink_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_pkey",
DROP COLUMN "_id";

-- AlterTable
ALTER TABLE "EventTask" DROP CONSTRAINT "EventTask_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "EventTask_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LinkApplyInstructions" DROP CONSTRAINT "LinkApplyInstructions_pkey",
DROP COLUMN "_id",
ALTER COLUMN "eventLinkId" SET NOT NULL,
ADD CONSTRAINT "LinkApplyInstructions_pkey" PRIMARY KEY ("eventLinkId");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_pkey",
DROP COLUMN "_id",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "EventsOnUser";

-- CreateIndex
CREATE UNIQUE INDEX "EventLinkRedeem_userId_eventLinkId_key" ON "EventLinkRedeem"("userId", "eventLinkId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLink" ADD CONSTRAINT "EventLink_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTask" ADD CONSTRAINT "EventTask_eventTaskId_fkey" FOREIGN KEY ("eventTaskId") REFERENCES "EventTask"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkApplyInstructions" ADD CONSTRAINT "LinkApplyInstructions_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
