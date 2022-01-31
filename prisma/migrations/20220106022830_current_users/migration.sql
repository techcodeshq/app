-- CreateTable
CREATE TABLE "current_users" (
    "email" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "current_users_email_key" ON "current_users"("email");
