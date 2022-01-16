-- DropForeignKey
ALTER TABLE "EventTask" DROP CONSTRAINT "EventTask_eventId_fkey";

-- AddForeignKey
ALTER TABLE "EventTask" ADD CONSTRAINT "EventTask_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
