import { PrismaService } from '../prisma/prisma.service';
import { BotUser } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByTelegramId(telegramId: bigint): Promise<BotUser | null>;
    findByRefCode(refCode: string): Promise<BotUser | null>;
    findByReferrerId(referrerId: string): Promise<BotUser[]>;
    getTopReferrers(limit?: number): Promise<BotUser[]>;
    updateQualifiedCount(userId: string, bonus: number): Promise<{
        id: string;
        createdAt: Date;
        telegramId: bigint;
        refCode: string;
        updatedAt: Date;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        languageCode: string | null;
        phone: string | null;
        referredById: string | null;
        referredAt: Date | null;
        leadsCount: number;
        qualifiedCount: number;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    createOrUpdateFromTelegram(tg: {
        telegramId: bigint;
        username?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        languageCode?: string | null;
    }): Promise<BotUser>;
}
