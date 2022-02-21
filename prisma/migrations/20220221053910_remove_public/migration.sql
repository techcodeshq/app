/*
  Warnings:

  - You are about to drop the column `public` on the `LinkApplyInstructions` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `UserMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LinkApplyInstructions" DROP COLUMN "public";

-- AlterTable
ALTER TABLE "UserMetadata" DROP COLUMN "public";
