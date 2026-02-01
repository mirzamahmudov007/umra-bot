import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateRefCode } from '../utils/refcode';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByTelegramId(telegramId: bigint) {
    return this.prisma.botUser.findUnique({ where: { telegramId } });
  }

  async findByRefCode(refCode: string) {
    return this.prisma.botUser.findUnique({ where: { refCode } });
  }

  async createOrUpdateFromTelegram(tg: {
    telegramId: bigint;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    languageCode?: string | null;
  }) {
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
        if (String(e?.code) === 'P2002') continue;
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
