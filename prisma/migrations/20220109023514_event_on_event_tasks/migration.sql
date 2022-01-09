/*
  Warnings:

  - Added the required column `eventId` to the `EventTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventTask" ADD COLUMN     "eventId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EventTaskOnUser" (
    "userId" TEXT NOT NULL,
    "eventTaskId" TEXT NOT NULL,

    CONSTRAINT "EventTaskOnUser_pkey" PRIMARY KEY ("userId","eventTaskId")
);

-- AddForeignKey
ALTER TABLE "EventTask" ADD CONSTRAINT "EventTask_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTaskOnUser" ADD CONSTRAINT "EventTaskOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTaskOnUser" ADD CONSTRAINT "EventTaskOnUser_eventTaskId_fkey" FOREIGN KEY ("eventTaskId") REFERENCES "EventTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
