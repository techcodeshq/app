/*
  Warnings:

  - You are about to drop the column `osis` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClubMemberStatus" AS ENUM ('Returning', 'New');

-- CreateEnum
CREATE TYPE "ClubDays" AS ENUM ('Python', 'WebDev', 'Both');

-- CreateEnum
CREATE TYPE "ClubSGOSticker" AS ENUM ('Yes', 'NoPlanningToBuy', 'NoNotPlanningToBuy');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "osis";

-- CreateTable
CREATE TABLE "ClubMemberInfo" (
    "userId" TEXT NOT NULL,
    "osis" TEXT NOT NULL,
    "prefect" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "doeEmail" TEXT,
    "nycEmail" TEXT,
    "class" TEXT NOT NULL,
    "sgoSticker" "ClubSGOSticker" NOT NULL,
    "status" "ClubMemberStatus" NOT NULL,
    "days" "ClubDays" NOT NULL,
    "comfortability" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubMemberInfo_userId_key" ON "ClubMemberInfo"("userId");

-- AddForeignKey
ALTER TABLE "ClubMemberInfo" ADD CONSTRAINT "ClubMemberInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
