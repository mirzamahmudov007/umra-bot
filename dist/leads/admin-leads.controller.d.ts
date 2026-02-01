import { LeadsService } from './leads.service';
import { LeadsQueryDto } from './dto';
export declare class AdminLeadsController {
    private leads;
    constructor(leads: LeadsService);
    list(q: LeadsQueryDto): Promise<{
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
    qualify(id: string): Promise<{
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
