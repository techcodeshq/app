/*
  Warnings:

  - Added the required column `_id` to the `KeyValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "KeyValue_key_key";

-- AlterTable
ALTER TABLE "KeyValue" ADD COLUMN     "_id" TEXT NOT NULL,
ADD CONSTRAINT "KeyValue_pkey" PRIMARY KEY ("_id");
