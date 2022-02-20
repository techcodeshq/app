/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_slug_key" ON "Branch"("slug");
