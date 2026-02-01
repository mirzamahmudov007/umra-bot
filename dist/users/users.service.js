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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const refcode_1 = require("../utils/refcode");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByTelegramId(telegramId) {
        return this.prisma.botUser.findUnique({ where: { telegramId } });
    }
    async findByRefCode(refCode) {
        return this.prisma.botUser.findUnique({ where: { refCode } });
    }
    async findByReferrerId(referrerId) {
        return this.prisma.botUser.findMany({
            where: { referredById: referrerId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getTopReferrers(limit = 10) {
        const result = await this.prisma.botUser.findMany({
            where: { leadsCount: { gt: 0 } },
            orderBy: [
                { leadsCount: 'desc' },
                { qualifiedCount: 'desc' }
            ],
            take: limit,
            select: {
                id: true,
                firstName: true,
                username: true,
                leadsCount: true,
                qualifiedCount: true,
                createdAt: true
            }
        });
        return result;
    }
    async updateQualifiedCount(userId, bonus) {
        return this.prisma.botUser.update({
            where: { id: userId },
            data: { qualifiedCount: { increment: bonus } }
        });
    }
    async createOrUpdateFromTelegram(tg) {
        const existing = await this.findByTelegramId(tg.telegramId);
        if (existing) {
            return this.prisma.botUser.update({
                where: { telegramId: tg.telegramId },
                data: {
                    username: tg.username ?? null,
                    firstName: tg.firstName ?? null,
                    lastName: tg.lastName ?? null,
                    languageCode: tg.languageCode ?? null,
                },
            });
        }
        for (let i = 0; i < 5; i++) {
            const refCode = (0, refcode_1.generateRefCode)(10);
            try {
                return await this.prisma.botUser.create({
                    data: {
                        telegramId: tg.telegramId,
                        username: tg.username ?? null,
                        firstName: tg.firstName ?? null,
                        lastName: tg.lastName ?? null,
                        languageCode: tg.languageCode ?? null,
                        refCode,
                    },
                });
            }
            catch (e) {
                if (String(e?.code) === "P2002")
                    continue;
                throw e;
            }
        }
        return this.prisma.botUser.create({
            data: {
                telegramId: tg.telegramId,
                username: tg.username ?? null,
                firstName: tg.firstName ?? null,
                lastName: tg.lastName ?? null,
                languageCode: tg.languageCode ?? null,
                refCode: (0, refcode_1.generateRefCode)(12),
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map