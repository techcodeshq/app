-- CreateEnum
CREATE TYPE "EventLinkRedeemStatus" AS ENUM ('SUCCESS', 'LATE', 'FAILED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'EXEC');

-- CreateTable
CREATE TABLE "Account" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "_id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "osis" TEXT,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EventLink" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "linkCode" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventLink_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EventLinkRedeem" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventLinkId" TEXT NOT NULL,
    "status" "EventLinkRedeemStatus" NOT NULL,
    "statusDescription" TEXT NOT NULL,

    CONSTRAINT "EventLinkRedeem_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EventTask" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventTaskId" TEXT,

    CONSTRAINT "EventTask_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "KeyValue" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "_id" TEXT NOT NULL,

    CONSTRAINT "KeyValue_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EventsOnUser" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventsOnUser_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_osis_key" ON "User"("osis");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventLink_linkCode_key" ON "EventLink"("linkCode");

-- CreateIndex
CREATE UNIQUE INDEX "KeyValue_key_key" ON "KeyValue"("key");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLink" ADD CONSTRAINT "EventLink_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLinkRedeem" ADD CONSTRAINT "EventLinkRedeem_eventLinkId_fkey" FOREIGN KEY ("eventLinkId") REFERENCES "EventLink"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTask" ADD CONSTRAINT "EventTask_eventTaskId_fkey" FOREIGN KEY ("eventTaskId") REFERENCES "EventTask"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "KeyValue" ADD CONSTRAINT "KeyValue__id_fkey" FOREIGN KEY ("_id") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsOnUser" ADD CONSTRAINT "EventsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsOnUser" ADD CONSTRAINT "EventsOnUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
