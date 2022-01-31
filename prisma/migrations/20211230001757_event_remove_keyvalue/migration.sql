/*
  Warnings:

  - The primary key for the `KeyValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `KeyValue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "KeyValue" DROP CONSTRAINT "KeyValue__id_fkey";

-- AlterTable
ALTER TABLE "KeyValue" DROP CONSTRAINT "KeyValue_pkey",
DROP COLUMN "_id";
