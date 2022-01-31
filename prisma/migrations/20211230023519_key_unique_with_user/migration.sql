/*
  Warnings:

  - A unique constraint covering the columns `[key,userId]` on the table `UserMetadata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_key_userId_key" ON "UserMetadata"("key", "userId");
