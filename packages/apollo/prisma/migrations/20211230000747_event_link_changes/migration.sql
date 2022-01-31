/*
  Warnings:

  - You are about to drop the column `linkCode` on the `EventLink` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `EventLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `EventLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `KeyValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public` to the `KeyValue` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `value` on the `KeyValue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "KeyValueAction" AS ENUM ('INCREMENT', 'DECREMENT', 'SET');

-- DropIndex
DROP INDEX "EventLink_linkCode_key";

-- AlterTable
ALTER TABLE "EventLink" DROP COLUMN "linkCode",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "KeyValue" ADD COLUMN     "action" "KeyValueAction" NOT NULL,
ADD COLUMN     "eventLinkId" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventLink_code_key" ON "EventLink"("code");

-- AddForeignKey
ALTER TABLE "KeyValue" ADD CONSTRAINT "KeyValue_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
