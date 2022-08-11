/*
  Warnings:

  - You are about to drop the column `doeEmail` on the `ClubMemberInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClubMemberInfo" DROP COLUMN "doeEmail",
ADD COLUMN     "bthsEmail" TEXT;
