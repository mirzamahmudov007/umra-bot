import { PrismaService } from "../prisma/prisma.service";
import { LeadStatus } from "@prisma/client";
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    createLeadIfNotExists(params: {
        leadUserId: string;
        referrerUserId: string;
        leadName?: string | null;
        leadUsername?: string | null;
        referrerName?: string | null;
        referrerUsername?: string | null;
    }): Promise<{
        created: boolean;
        lead: {
            id: string;
            leadUserId: string;
            createdAt: Date;
            qualifiedAt: Date | null;
            status: import(".prisma/client").$Enums.LeadStatus;
            referrerUserId: string;
            leadName: string | null;
            leadUsername: string | null;
            referrerName: string | null;
            referrerUsername: string | null;
            joinRequestId: string | null;
            joinedAt: Date | null;
        };
    } | {
        created: boolean;
        reason: "self_ref";
    }>;
    updateLeadStatus(telegramId: bigint, status: LeadStatus, joinRequestId?: string, chatId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findByLeadUserId(leadUserId: string): Promise<{
        referrerUser: {
            telegramId: bigint;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        leadUserId: string;
        createdAt: Date;
        qualifiedAt: Date | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        referrerUserId: string;
        leadName: string | null;
        leadUsername: string | null;
        referrerName: string | null;
        referrerUsername: string | null;
        joinRequestId: string | null;
        joinedAt: Date | null;
    }>;
    listLeads(query: {
        search?: string;
        status?: LeadStatus;
        page: number;
        limit: number;
    }): Promise<{
        items: ({
            leadUser: {
                telegramId: bigint;
                username: string;
                firstName: string;
                lastName: string;
            };
            referrerUser: {
                telegramId: bigint;
                username: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            leadUserId: string;
            createdAt: Date;
            qualifiedAt: Date | null;
            status: import(".prisma/client").$Enums.LeadStatus;
            referrerUserId: string;
            leadName: string | null;
            leadUsername: string | null;
            referrerName: string | null;
            referrerUsername: string | null;
            joinRequestId: string | null;
            joinedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getQualifiedLeads(): Promise<({
        leadUser: {
            telegramId: bigint;
            username: string;
            firstName: string;
            lastName: string;
        };
        referrerUser: {
            telegramId: bigint;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        leadUserId: string;
        createdAt: Date;
        qualifiedAt: Date | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        referrerUserId: string;
        leadName: string | null;
        leadUsername: string | null;
        referrerName: string | null;
        referrerUsername: string | null;
        joinRequestId: string | null;
        joinedAt: Date | null;
    })[]>;
    qualifyLead(leadId: string): Promise<{
        ok: boolean;
        already: boolean;
        lead: {
            id: string;
            leadUserId: string;
            createdAt: Date;
            qualifiedAt: Date | null;
            status: import(".prisma/client").$Enums.LeadStatus;
            referrerUserId: string;
            leadName: string | null;
            leadUsername: string | null;
            referrerName: string | null;
            referrerUsername: string | null;
            joinRequestId: string | null;
            joinedAt: Date | null;
        };
    }>;
}
