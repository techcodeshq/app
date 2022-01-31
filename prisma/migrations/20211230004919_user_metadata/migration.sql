/*
  Warnings:

  - You are about to drop the `KeyValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KeyValue" DROP CONSTRAINT "KeyValue_eventLinkId_fkey";

-- DropTable
DROP TABLE "KeyValue";

-- CreateTable
CREATE TABLE "UserMetadata" (
    "_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "userId" TEXT,

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LinkApplyInstructions" (
    "_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "public" BOOLEAN NOT NULL,
    "action" "KeyValueAction" NOT NULL,
    "eventLinkId" TEXT,

    CONSTRAINT "LinkApplyInstructions_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkApplyInstructions" ADD CONSTRAINT "LinkApplyInstructions_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
