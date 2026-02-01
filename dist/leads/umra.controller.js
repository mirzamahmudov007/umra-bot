"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmraController = exports.UmraPurchaseDto = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const users_service_1 = require("../users/users.service");
class UmraPurchaseDto {
}
exports.UmraPurchaseDto = UmraPurchaseDto;
let UmraController = class UmraController {
    constructor(leadsService, usersService) {
        this.leadsService = leadsService;
        this.usersService = usersService;
    }
    async handlePurchase(purchaseData) {
        try {
            const { telegramId, purchaseId, amount } = purchaseData;
            const user = await this.usersService.findByTelegramId(BigInt(telegramId));
            if (!user) {
                return {
                    success: false,
                    message: 'Foydalanuvchi topilmadi',
                };
            }
            const lead = await this.leadsService.findByLeadUserId(user.id);
            if (!lead || lead.referrerUserId === user.id) {
                return {
                    success: false,
                    message: 'Referral topilmadi',
                };
            }
            const referrer = await this.usersService.findByTelegramId(BigInt(lead.referrerUserId));
            if (!referrer) {
                return {
                    success: false,
                    message: 'Referrer topilmadi',
                };
            }
            await this.leadsService.qualifyLead(lead.id);
            await this.usersService.updateQualifiedCount(referrer.id, 5);
            try {
                console.log(`Referrerga xabar yuborildi: ${referrer.telegramId} - Toza lead: ${user.firstName}`);
            }
            catch (error) {
                console.log('Referrerga xabar yuborishda xato:', error);
            }
            return {
                success: true,
                message: 'Umra chiptasi sotib olish muvaffaqiyatli qayd etildi',
                data: {
                    userId: user.id,
                    referrerId: referrer.id,
                    purchaseId,
                    amount,
                },
            };
        }
        catch (error) {
            console.error('Umra purchase xatosi:', error);
            return {
                success: false,
                message: 'Server xatosi',
            };
        }
    }
    async checkPurchases() {
        try {
            const qualifiedLeads = await this.leadsService.getQualifiedLeads();
            const purchases = qualifiedLeads.map(lead => ({
                userId: lead.leadUserId,
                referrerId: lead.referrerUserId,
                qualifiedAt: lead.qualifiedAt,
                leadName: lead.leadName,
                referrerName: lead.referrerName,
            }));
            return {
                success: true,
                message: 'Umra chiptasi sotib olganlar ro\'yxati',
                data: purchases,
            };
        }
        catch (error) {
            console.error('Check purchases xatosi:', error);
            return {
                success: false,
                message: 'Server xatosi',
            };
        }
    }
};
exports.UmraController = UmraController;
__decorate([
    (0, common_1.Post)('purchase'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UmraPurchaseDto]),
    __metadata("design:returntype", Promise)
], UmraController.prototype, "handlePurchase", null);
__decorate([
    (0, common_1.Post)('check-purchases'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UmraController.prototype, "checkPurchases", null);
exports.UmraController = UmraController = __decorate([
    (0, common_1.Controller)('api/umra'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService,
        users_service_1.UsersService])
], UmraController);
//# sourceMappingURL=umra.controller.js.map