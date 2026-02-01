import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByTelegramId(telegramId: bigint): Promise<{
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
    findByRefCode(refCode: string): Promise<{
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
    }): Promise<{
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
}
