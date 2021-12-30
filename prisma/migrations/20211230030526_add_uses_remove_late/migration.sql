/*
  Warnings:

  - The values [LATE] on the enum `EventLinkRedeemStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventLinkRedeemStatus_new" AS ENUM ('SUCCESS', 'FAILED');
ALTER TABLE "EventLinkRedeem" ALTER COLUMN "status" TYPE "EventLinkRedeemStatus_new" USING ("status"::text::"EventLinkRedeemStatus_new");
ALTER TYPE "EventLinkRedeemStatus" RENAME TO "EventLinkRedeemStatus_old";
ALTER TYPE "EventLinkRedeemStatus_new" RENAME TO "EventLinkRedeemStatus";
DROP TYPE "EventLinkRedeemStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "EventLink" ADD COLUMN     "uses" INTEGER;
