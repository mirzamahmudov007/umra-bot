-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED');

-- CreateTable
CREATE TABLE "BotUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "languageCode" TEXT,
    "phone" TEXT,
    "refCode" TEXT NOT NULL,
    "referredById" TEXT,
    "referredAt" TIMESTAMP(3),
    "leadsCount" INTEGER NOT NULL DEFAULT 0,
    "qualifiedCount" INTEGER NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "BotUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualifiedAt" TIMESTAMP(3),
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "leadUserId" TEXT NOT NULL,
    "referrerUserId" TEXT NOT NULL,
    "leadName" TEXT,
    "leadUsername" TEXT,
    "referrerName" TEXT,
    "referrerUsername" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_telegramId_key" ON "BotUser"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_refCode_key" ON "BotUser"("refCode");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_leadUserId_key" ON "Lead"("leadUserId");

-- AddForeignKey
ALTER TABLE "BotUser" ADD CONSTRAINT "BotUser_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "BotUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_leadUserId_fkey" FOREIGN KEY ("leadUserId") REFERENCES "BotUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_referrerUserId_fkey" FOREIGN KEY ("referrerUserId") REFERENCES "BotUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
