import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotUser } from '@prisma/client';
import { generateRefCode } from '../utils/refcode';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByTelegramId(telegramId: bigint): Promise<BotUser | null> {
    return this.prisma.botUser.findUnique({ where: { telegramId } });
  }

  async findByRefCode(refCode: string): Promise<BotUser | null> {
    return this.prisma.botUser.findUnique({ where: { refCode } });
  }

  async findByReferrerId(referrerId: string): Promise<BotUser[]> {
    return this.prisma.botUser.findMany({
      where: { referredById: referrerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTopReferrers(limit: number = 10): Promise<BotUser[]> {
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

    return result as BotUser[];
  }

  async updateQualifiedCount(userId: string, bonus: number) {
    return this.prisma.botUser.update({
      where: { id: userId },
      data: { qualifiedCount: { increment: bonus } }
    });
  }

  async createOrUpdateFromTelegram(tg: {
    telegramId: bigint;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    languageCode?: string | null;
  }): Promise<BotUser> {
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

    // refCode unique bo'lishi shart
    // collision juda kam, lekin baribir retry qilamiz
    for (let i = 0; i < 5; i++) {
      const refCode = generateRefCode(10);
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
      } catch (e: any) {
        // unique constraint collision bo'lsa retry
        if (String(e?.code) === "P2002") continue;
        throw e;
      }
    }

    // oxirgi urinish
    return this.prisma.botUser.create({
      data: {
        telegramId: tg.telegramId,
        username: tg.username ?? null,
        firstName: tg.firstName ?? null,
        lastName: tg.lastName ?? null,
        languageCode: tg.languageCode ?? null,
        refCode: generateRefCode(12),
      },
    });
  }
}
