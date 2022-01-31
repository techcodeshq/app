/*
  Warnings:

  - Added the required column `public` to the `UserMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_userId_fkey";

-- AlterTable
ALTER TABLE "UserMetadata" ADD COLUMN     "public" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
