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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLeadIfNotExists(params) {
        if (params.leadUserId === params.referrerUserId) {
            return { created: false, reason: 'self_ref' };
        }
        try {
            const lead = await this.prisma.$transaction(async (tx) => {
                const existing = await tx.lead.findUnique({
                    where: { leadUserId: params.leadUserId },
                });
                if (existing)
                    return { created: false, lead: existing };
                const created = await tx.lead.create({
                    data: {
                        leadUserId: params.leadUserId,
                        referrerUserId: params.referrerUserId,
                        status: 'NEW',
                        leadName: params.leadName ?? null,
                        leadUsername: params.leadUsername ?? null,
                        referrerName: params.referrerName ?? null,
                        referrerUsername: params.referrerUsername ?? null,
                    },
                });
                await tx.botUser.update({
                    where: { id: params.referrerUserId },
                    data: { leadsCount: { increment: 1 } },
                });
                return { created: true, lead: created };
            });
            return lead;
        }
        catch (e) {
            if (String(e?.code) === 'P2002') {
                const existing = await this.prisma.lead.findUnique({
                    where: { leadUserId: params.leadUserId },
                });
                return { created: false, lead: existing };
            }
            throw e;
        }
    }
    async listLeads(query) {
        const { search, status, page, limit } = query;
        const where = {};
        if (status)
            where.status = status;
        if (search?.trim()) {
            const s = search.trim();
            const maybeNum = BigInt.asUintN(64, BigInt(Number.isFinite(Number(s)) ? s : '0'));
            const or = [
                { leadName: { contains: s, mode: 'insensitive' } },
                { leadUsername: { contains: s, mode: 'insensitive' } },
                { referrerName: { contains: s, mode: 'insensitive' } },
                { referrerUsername: { contains: s, mode: 'insensitive' } },
            ];
            if (/^\d+$/.test(s)) {
                or.push({ leadUser: { telegramId: maybeNum } });
                or.push({ referrerUser: { telegramId: maybeNum } });
            }
            where.OR = or;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    leadUser: {
                        select: {
                            telegramId: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                    referrerUser: {
                        select: {
                            telegramId: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            }),
            this.prisma.lead.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async updateLeadStatus(telegramId, status, joinRequestId, chatId) {
        const user = await this.prisma.botUser.findUnique({
            where: { telegramId }
        });
        if (!user)
            return null;
        return this.prisma.lead.updateMany({
            where: {
                leadUserId: user.id,
                status: status === 'JOINED' ? 'PENDING' : status
            },
            data: {
                status,
                ...(status === 'JOINED' && {
                    joinRequestId,
                    joinedAt: new Date()
                })
            }
        });
    }
    async findByLeadUserId(leadUserId) {
        return this.prisma.lead.findFirst({
            where: { leadUserId },
            include: {
                referrerUser: {
                    select: { telegramId: true, firstName: true, lastName: true, username: true }
                }
            }
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
return this.prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findUnique({ where: { id: leadId } });
    if (!lead)
        throw new common_1.NotFoundException('Lead topilmadi');
    if (lead.status === 'QUALIFIED') {
        return { ok: true, already: true, lead };
    }
    const updated = await tx.lead.update({
        where: { id: leadId },
        data: {
            status: 'QUALIFIED',
            qualifiedAt: new Date(),
        },
    });
    await tx.botUser.update({
        where: { id: lead.referrerUserId },
        data: { qualifiedCount: { increment: 1 } },
    });
    return { ok: true, already: false, lead: updated };
});
//# sourceMappingURL=leads.service.backup.js.map