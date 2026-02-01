import { LeadsService } from './leads.service';
import { UsersService } from '../users/users.service';
export declare class UmraPurchaseDto {
    telegramId: string;
    purchaseId: string;
    amount: number;
}
export declare class UmraController {
    private leadsService;
    private usersService;
    constructor(leadsService: LeadsService, usersService: UsersService);
    handlePurchase(purchaseData: UmraPurchaseDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            userId: string;
            referrerId: string;
            purchaseId: string;
            amount: number;
        };
    }>;
    checkPurchases(): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            referrerId: string;
            qualifiedAt: Date;
            leadName: string;
            referrerName: string;
        }[];
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
