/*
  Warnings:

  - The primary key for the `LinkApplyInstructions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[key,eventLinkId]` on the table `LinkApplyInstructions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LinkApplyInstructions" DROP CONSTRAINT "LinkApplyInstructions_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "LinkApplyInstructions_key_eventLinkId_key" ON "LinkApplyInstructions"("key", "eventLinkId");
