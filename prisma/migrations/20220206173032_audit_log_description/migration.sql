/*
  Warnings:

  - Added the required column `description` to the `AuditLogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLogEntry" ADD COLUMN     "description" TEXT NOT NULL;
