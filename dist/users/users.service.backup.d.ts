import { BotUser } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByTelegramId(telegramId: bigint): Promise<BotUser | null>;
    findByRefCode(refCode: string): Promise<BotUser | null>;
    findByReferrerId(referrerId: string): Promise<BotUser[]>;
    getTopReferrers(limit?: number): Promise<BotUser[]>;
    const existing: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        telegramId: bigint;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        languageCode: string | null;
        phone: string | null;
        refCode: string;
        referredById: string | null;
        referredAt: Date | null;
        leadsCount: number;
        qualifiedCount: number;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.UserRole;
    };
    if(existing: any): import(".prisma/client").Prisma.Prisma__BotUserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        telegramId: bigint;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        languageCode: string | null;
        phone: string | null;
        refCode: string;
        referredById: string | null;
        referredAt: Date | null;
        leadsCount: number;
        qualifiedCount: number;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.UserRole;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    for(let: any, i: number, i: any, : any, : any, i: any): any;
}
