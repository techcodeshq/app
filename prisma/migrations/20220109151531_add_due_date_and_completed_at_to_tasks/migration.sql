/*
  Warnings:

  - Added the required column `dueDate` to the `EventTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventTask" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
