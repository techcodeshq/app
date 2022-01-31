-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_eventLinkId_fkey";

-- DropForeignKey
ALTER TABLE "EventLinkRedeem" DROP CONSTRAINT "EventLinkRedeem_userId_fkey";

-- DropForeignKey
ALTER TABLE "LinkApplyInstructions" DROP CONSTRAINT "LinkApplyInstructions_eventLinkId_fkey";

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkApplyInstructions" ADD CONSTRAINT "LinkApplyInstructions_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
