-- Ball tizimini qo'shish

-- BotUser table ga yangi fieldlar
ALTER TABLE "BotUser" ADD COLUMN "totalBalls" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BotUser" ADD COLUMN "directReferralBalls" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BotUser" ADD COLUMN "qualifiedBalls" INTEGER NOT NULL DEFAULT 0;

-- Lead table ga ball tizimini qo'shish
ALTER TABLE "Lead" ADD COLUMN "ballsAwarded" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Lead" ADD COLUMN "ballsAwardedAt" TIMESTAMP(3);

-- Bot'ing index-larini qo'shish
CREATE INDEX "BotUser_totalBalls_idx" ON "BotUser"("totalBalls" DESC);
CREATE INDEX "BotUser_isChannelMember_idx" ON "BotUser"("isChannelMember");
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt" DESC);
