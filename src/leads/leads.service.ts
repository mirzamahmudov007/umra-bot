import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Lead, BotUser, LeadStatus } from "@prisma/client";

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

  async createLeadIfNotExists(params: {
    leadUserId: string;
    referrerUserId: string;
    leadName?: string | null;
    leadUsername?: string | null;
    referrerName?: string | null;
    referrerUsername?: string | null;
  }) {
    if (params.leadUserId === params.referrerUserId) {
      return { created: false, reason: "self_ref" as const };
    }

    try {
      const lead = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.lead.findUnique({
          where: { leadUserId: params.leadUserId },
        });
        if (existing) return { created: false, lead: existing };

        const created = await tx.lead.create({
          data: {
            leadUserId: params.leadUserId,
            referrerUserId: params.referrerUserId,
            status: "PENDING",
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
    } catch (e: any) {
      if (String(e?.code) === "P2002") {
        const existing = await this.prisma.lead.findUnique({
          where: { leadUserId: params.leadUserId },
        });
        return { created: false, lead: existing };
      }
      throw e;
    }
  }

  async updateLeadStatus(
    telegramId: bigint,
    status: LeadStatus,
    joinRequestId?: string,
    chatId?: string
  ) {
    const user = await this.prisma.botUser.findUnique({
      where: { telegramId },
    });

    if (!user) return null;

    const updateData: any = { status };

    if (status === "JOINED") {
      updateData.joinRequestId = joinRequestId;
      updateData.joinedAt = new Date();
    }

    return this.prisma.lead.updateMany({
      where: {
        leadUserId: user.id,
        status: status === "JOINED" ? "PENDING" : status,
      },
      data: updateData,
    });
  }

  async findByLeadUserId(leadUserId: string) {
    return this.prisma.lead.findFirst({
      where: { leadUserId },
      include: {
        referrerUser: {
          select: { telegramId: true, firstName: true, lastName: true, username: true },
        },
      },
    });
  }

  async listLeads(query: { search?: string; status?: LeadStatus; page: number; limit: number }) {
    const { search, status, page, limit } = query;

    const where: any = {};
    if (status) where.status = status;

    if (search?.trim()) {
      const s = search.trim();
      const maybeNum = BigInt.asUintN(64, BigInt(Number.isFinite(Number(s)) ? s : "0"));
      const or: any[] = [
        { leadName: { contains: s, mode: "insensitive" } },
        { leadUsername: { contains: s, mode: "insensitive" } },
        { referrerName: { contains: s, mode: "insensitive" } },
        { referrerUsername: { contains: s, mode: "insensitive" } },
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
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          leadUser: { select: { telegramId: true, firstName: true, lastName: true, username: true } },
          referrerUser: { select: { telegramId: true, firstName: true, lastName: true, username: true } },
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

  async getQualifiedLeads() {
    return this.prisma.lead.findMany({
      where: { status: 'QUALIFIED' },
      include: {
        leadUser: {
          select: { telegramId: true, firstName: true, lastName: true, username: true }
        },
        referrerUser: {
          select: { telegramId: true, firstName: true, lastName: true, username: true }
        }
      },
      orderBy: { qualifiedAt: 'desc' }
    });
  }

  async qualifyLead(leadId: string) {
    return this.prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({ where: { id: leadId } });
      if (!lead) throw new NotFoundException("Lead topilmadi");

      if (lead.status === "QUALIFIED") {
        return { ok: true, already: true, lead };
      }

      const BALLS_PER_QUALIFIED = 5;
      
      const updated = await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "QUALIFIED",
          qualifiedAt: new Date(),
        },
      });

      // Refera​rga balllarni qo'shish
      await tx.botUser.update({
        where: { id: lead.referrerUserId },
        data: { 
          qualifiedCount: { increment: 1 },
          totalBalls: { increment: BALLS_PER_QUALIFIED },
        },
      });

      return { ok: true, already: false, lead: updated };
    });
  }

  // Lead-ning direct referral ball-larini qo'shish
  async addDirectReferralBall(referrerUserId: string) {
    const BALLS_PER_REFERRAL = 1;
    
    return this.prisma.botUser.update({
      where: { id: referrerUserId },
      data: {
        totalBalls: { increment: BALLS_PER_REFERRAL },
      },
    });
  }

  // Admin statistikasi
  async getLeadsStats() {
    const [totalLeads, pendingLeads, joinedLeads, qualifiedLeads] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: 'PENDING' } }),
      this.prisma.lead.count({ where: { status: 'JOINED' } }),
      this.prisma.lead.count({ where: { status: 'QUALIFIED' } }),
    ]);

    const totalUsers = await this.prisma.botUser.count();
    const totalQualifiedBalls = await this.prisma.botUser.aggregate({
      _sum: { qualifiedCount: true },
    });

    return {
      totalLeads,
      pendingLeads,
      joinedLeads,
      qualifiedLeads,
      totalUsers,
      conversionRate: totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(2) : 0,
      totalQualifiedCount: totalQualifiedBalls._sum.qualifiedCount || 0,
    };
  }

  // Top referrers ba ballalar bilan
  async getTopReferrersWithBalls(limit: number = 20) {
    return this.prisma.botUser.findMany({
      where: { leadsCount: { gt: 0 } },
      orderBy: [
        { qualifiedCount: 'desc' },
        { leadsCount: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        firstName: true,
        username: true,
        leadsCount: true,
        qualifiedCount: true,
        createdAt: true,
        _count: {
          select: {
            referredUsers: true,
          },
        },
      },
    }).then((users) =>
      users.map((u: any) => ({
        ...u,
        totalBalls: u.qualifiedCount * 5 + u.leadsCount,
        rank: 0,
      }))
    ).then((users) =>
      users.map((u, i) => ({
        ...u,
        rank: i + 1,
      }))
    );
  }
}
