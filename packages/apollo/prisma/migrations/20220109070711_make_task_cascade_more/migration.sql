-- DropForeignKey
ALTER TABLE "EventTaskOnUser" DROP CONSTRAINT "EventTaskOnUser_eventTaskId_fkey";

-- AddForeignKey
ALTER TABLE "EventTaskOnUser" ADD CONSTRAINT "EventTaskOnUser_eventTaskId_fkey" FOREIGN KEY ("eventTaskId") REFERENCES "EventTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
