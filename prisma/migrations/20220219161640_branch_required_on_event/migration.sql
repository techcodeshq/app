/*
  Warnings:

  - Made the column `branchId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_branchId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "branchId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
