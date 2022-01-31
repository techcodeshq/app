-- DropForeignKey
ALTER TABLE "EventTask" DROP CONSTRAINT "EventTask_eventTaskId_fkey";

-- AddForeignKey
ALTER TABLE "EventTask" ADD CONSTRAINT "EventTask_eventTaskId_fkey" FOREIGN KEY ("eventTaskId") REFERENCES "EventTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
