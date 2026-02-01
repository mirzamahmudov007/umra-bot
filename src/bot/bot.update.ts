import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Command, Action, On, Hears } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { UsersService } from '../users/users.service';
import { LeadsService } from '../leads/leads.service';
import { parseStartPayload } from '../utils/refcode';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../common/logger.service';
import { RateLimiterService } from '../common/rate-limiter.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly GROUP_CHAT_ID: string;
  private readonly BOT_USERNAME: string;
  private readonly CHANNEL_USERNAME: string;

  constructor(
    private users: UsersService,
    private leads: LeadsService,
    private config: ConfigService,
    private logger: LoggerService,
    private rateLimiter: RateLimiterService,
  ) {
    this.GROUP_CHAT_ID = this.config.get<string>('GROUP_CHAT_ID') || '';
    this.BOT_USERNAME = this.config.get<string>('BOT_USERNAME') || 'your_bot';
    this.CHANNEL_USERNAME = this.config.get<string>('CHANNEL_USERNAME') || 'ochiqkanal11';
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    try {
      // Rate limiting - spam tekshirish
      const rateLimitKey = `start_${from.id}`;
      if (!this.rateLimiter.isAllowed(rateLimitKey, { maxAttempts: 5, windowMs: 10000 })) {
        await ctx.reply('⏱️ Ozbir shoshilmang! Bir oz kutib ko\'ring...', { parse_mode: 'HTML' });
        this.logger.warn('BotUpdate', `Rate limit exceeded for user ${from.id}`);
        return;
      }

      this.logger.info('BotUpdate', `Start command: ${from.id}`, { username: from.username });

      // 1. Foydalanuvchini yaratish/yangilash
      const me = await this.users.createOrUpdateFromTelegram({
        telegramId: BigInt(from.id),
        username: from.username ?? null,
        firstName: from.first_name ?? null,
        lastName: from.last_name ?? null,
        languageCode: from.language_code ?? null,
      });

      // 2. Kanal a'zoligini tekshirish
      const isMember = await this.checkChannelMembership(ctx, from.id);

      if (!isMember) {
        // Kanalga a'zo bo'lishni so'rash
        await this.askToJoinChannel(ctx);
        return;
      }

      // 3. Start payload tekshirish (referral kod)
      const payload = ctx.startPayload;
      if (payload) {
        await this.handleReferral(ctx, me, payload);
      }

      // 4. Agar kanalda bo'lsa, asosiy menyuni ko'rsatish
      await this.showMainMenu(ctx, me);
    } catch (error) {
      this.logger.error('BotUpdate', 'Start command da xato', error);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', { parse_mode: 'HTML' });
    }
  }

  // Kanal a'zoligini tekshirish
  private async checkChannelMembership(ctx: Context, userId: number): Promise<boolean> {
    if (!this.GROUP_CHAT_ID) {
      this.logger.debug('BotUpdate', 'GROUP_CHAT_ID configured emas, default true');
      return true;
    }

    try {
      const chatMember = await ctx.telegram.getChatMember(this.GROUP_CHAT_ID, userId);
      const isMember = ['creator', 'administrator', 'member'].includes(chatMember.status);
      
      if (isMember) {
        // A'zolik status-ni DB-ga saqlash
        await this.users.updateChannelMembership(BigInt(userId), true);
      }
      
      return isMember;
    } catch (error) {
      this.logger.warn('BotUpdate', `Kanal a'zoligini tekshirishda xato: ${userId}`, error);
      return false;
    }
  }

  // Kanalga a'zo bo'lish so'rovini yuborish
  private async askToJoinChannel(@Ctx() ctx: Context) {
    const message = `🎉 <b>Assalomu Alaykum!</b>\n\n` +
      `<b>Botdan foydalanish uchun quyidagi kanalga a'zo bo'ling:</b>\n\n` +
      `✨ <i>Umra sayohati haqida barcha ma'lumotlar kanali</i>`;

    try {
      await ctx.replyWithHTML(message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 Kanalga A'zo Bo'lish",
                url: `https://t.me/${this.CHANNEL_USERNAME}`
              }
            ],
            [
              {
                text: "✅ A'zo Bo'ldim",
                callback_data: "check_channel_membership"
              }
            ]
          ]
        }
      });
    } catch (error) {
      this.logger.error('BotUpdate', 'askToJoinChannel da xato', error);
    }
  }

  // Asosiy menyuni ko'rsatish (faqat 2 ta button)
  private async showMainMenu(@Ctx() ctx: Context, user: any) {
    const message = `🎉 <b>Assalomu alaykum, ${user.firstName || 'Foydalanuvchi'}!</b>\n\n` +
      `✅ <b>Siz kanalga a'zo bo'lgansiz!</b>\n\n` +
      `<i>Quyidagi tugmalardan birini tanlang:</i>\n\n` +
      `💡 <b>Siz shunday foyda olishingiz mumkin:</b>\n` +
      `• Har bir taklif: <b>+1 ball</b>\n` +
      `• Har bir toza lead: <b>+5 ball</b>`;

    try {
      await ctx.replyWithHTML(message, {
        reply_markup: {
          keyboard: [
            ["🔗 Referral Link"],
            ["📊 Statistika"]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      });
    } catch (error) {
      this.logger.error('BotUpdate', 'showMainMenu da xato', error);
    }
  }

  // ========== CALLBACK HANDLERS ==========

  @Action('check_channel_membership')
  async onCheckChannelMembership(@Ctx() ctx: Context) {
    const userId = ctx.from?.id;

    try {
      await ctx.answerCbQuery();

      if (!userId) {
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.", { parse_mode: 'HTML' });
        return;
      }

      const isMember = await this.checkChannelMembership(ctx, userId);

      if (!isMember) {
        await ctx.reply("❌ <b>Hali kanalga a'zo bo'lmagansiz!</b>\n\nIltimos, avval kanalga a'zo bo'ling va keyin \"✅ A'zo Bo'ldim\" tugmasini bosing.", {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📢 Kanalga A'zo Bo'lish",
                  url: `https://t.me/${this.CHANNEL_USERNAME}`
                }
              ],
              [
                {
                  text: "✅ A'zo Bo'ldim",
                  callback_data: "check_channel_membership"
                }
              ]
            ]
          }
        });
        return;
      }

      // Agar kanalda bo'lsa, foydalanuvchini topish
      const user = await this.users.findByTelegramId(BigInt(userId));
      if (!user) {
        await ctx.reply("❌ Foydalanuvchi topilmadi. Iltimos, /start ni bosing.", { parse_mode: 'HTML' });
        return;
      }

      await ctx.reply("✅ <b>Tabriklaymiz! Siz kanalga a'zo bo'lgansiz!</b>", { parse_mode: 'HTML' });
      await this.showMainMenu(ctx, user);
    } catch (error) {
      this.logger.error('BotUpdate', 'check_channel_membership da xato', error);
      await ctx.reply("❌ Xatolik yuz berdi.", { parse_mode: 'HTML' });
    }
  }

  // ========== TEXT HANDLERS ==========

  @Hears('🔗 Referral Link')
  async onReferralLinkYaratish(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    try {
      // Kanal a'zoligini tekshirish
      const isMember = await this.checkChannelMembership(ctx, from.id);
      if (!isMember) {
        await this.askToJoinChannel(ctx);
        return;
      }

      const user = await this.users.findByTelegramId(BigInt(from.id));
      if (!user) {
        await ctx.reply("❌ Siz avval ro'yxatdan o'tmagansiz. /start ni bosing.", { parse_mode: 'HTML' });
        return;
      }

      const personalLink = `https://t.me/${this.BOT_USERNAME}?start=${user.refCode}`;

      const message = `<b>🎁 Bepul Umra Sayohati!</b>\n\n` +
        `<b>Qanday ishlaydi?</b>\n` +
        `1️⃣ Quyidagi linkni do'stlaringizga yuboring\n` +
        `2️⃣ Ular link orqali botga kirganda <b>+1 ball</b> olasiz\n` +
        `3️⃣ Ular umra chiptasi sotib olsa <b>+5 ball</b> qo'shilib qoladi\n\n` +
        `<b>100 ball to'laganingizda bepul Umra sayohatini qo'lga kiriting!</b>\n\n` +
        `🔗 <b>Sizning referral linkingiz:</b>\n` +
        `<code>${personalLink}</code>\n\n` +
        `📋 <i>Linkni nusxa olish uchun ustiga bosing</i>`;

      await ctx.replyWithHTML(message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 Kanalni Ko'rish",
                url: `https://t.me/${this.CHANNEL_USERNAME}`
              }
            ],
            [
              {
                text: "📊 Statistika",
                callback_data: "show_stats"
            },
              {
                text: "🔄 Qayta Yuklash",
                callback_data: "refresh_link"
              }
            ]
          ]
        }
      });
    } catch (error) {
      this.logger.error('BotUpdate', 'onReferralLinkYaratish da xato', error);
      await ctx.reply("❌ Xatolik yuz berdi.", { parse_mode: 'HTML' });
    }
  }

  @Hears('📊 Statistika')
  async onStatistika(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    try {
      // Kanal a'zoligini tekshirish
      const isMember = await this.checkChannelMembership(ctx, from.id);
      if (!isMember) {
        await this.askToJoinChannel(ctx);
        return;
      }

      const user = await this.users.findByTelegramId(BigInt(from.id));
      if (!user) {
        await ctx.reply("❌ Siz avval ro'yxatdan o'tmagansiz. /start ni bosing.", { parse_mode: 'HTML' });
        return;
      }

      const referrals = await this.users.findByReferrerId(user.id);
      const ballsNeeded = 100 - user.totalBalls;
      const progressPercent = Math.min(100, Math.round((user.totalBalls / 100) * 100));

      // Progress bar
      const filledBars = Math.round(progressPercent / 10);
      const emptyBars = 10 - filledBars;
      const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

      let message = `📊 <b>SIZNING STATISTIKANGIZ</b>\n\n`;
      message += `👤 <b>Ism:</b> ${user.firstName || 'Noma\'lum'}\n`;
      message += `🔗 <b>Referral kodingiz:</b> <code>${user.refCode}</code>\n\n`;

      message += `💰 <b>BALLALAR:</b>\n`;
      message += `🎯 <b>Jami ballalar:</b> <code>${user.totalBalls}/100</code>\n`;
      message += `${progressBar} ${progressPercent}%\n`;
      message += `📈 <b>Kerak qolgan:</b> ${Math.max(0, ballsNeeded)} ball\n\n`;

      message += `📈 <b>TAHLIL:</b>\n`;
      message += `• Jami takliflar: <b>${user.leadsCount}</b> (har biri +1 ball)\n`;
      message += `• Toza leadlar: <b>${user.qualifiedCount}</b> (har biri +5 ball)\n`;
      message += `• Sizning referrallaringiz: <b>${referrals.length}</b>\n\n`;

      message += `💡 <b>FOYDALAR:</b>\n`;
      message += `• Har bir taklif: <b>+1 ball</b> 🎁\n`;
      message += `• Har bir toza lead: <b>+5 ball</b> 🌟\n`;
      message += `• 100 ball = <b>Bepul Umra!</b> 🕌`;

      await ctx.replyWithHTML(message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔗 Referral Link",
                callback_data: "refresh_link"
              },
              {
                text: "🔄 Yangilash",
                callback_data: "show_stats"
              }
            ]
          ]
        }
      });
    } catch (error) {
      this.logger.error('BotUpdate', 'onStatistika da xato', error);
      await ctx.reply("❌ Xatolik yuz berdi.", { parse_mode: 'HTML' });
    }
  }

  // ========== CALLBACK HANDLERS ==========

  @Action('refresh_link')
  async onRefreshLink(@Ctx() ctx: Context) {
    try {
      await ctx.answerCbQuery();
      const userId = ctx.from?.id;

      if (!userId) return;

      const user = await this.users.findByTelegramId(BigInt(userId));
      if (!user) return;

      const personalLink = `https://t.me/${this.BOT_USERNAME}?start=${user.refCode}`;

      const message = `🔗 <b>Sizning referral linkingiz:</b>\n\n` +
        `<code>${personalLink}</code>\n\n` +
        `📋 <i>Linkni nusxa olish uchun ustiga bosing</i>\n\n` +
        `✅ <i>Link do'stlaringizga yuboring!</i>`;

      await ctx.replyWithHTML(message);
    } catch (error) {
      this.logger.error('BotUpdate', 'refresh_link da xato', error);
    }
  }

  @Action('show_stats')
  async onShowStats(@Ctx() ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await this.onStatistika(ctx);
    } catch (error) {
      this.logger.error('BotUpdate', 'show_stats da xato', error);
    }
  }

  // ========== REFERRAL HANDLING ==========

  // Bu funksiya start payload bilan kelganda ishlaydi
  private async handleReferral(@Ctx() ctx: Context, me: any, refCode: string) {
    try {
      const referrer = await this.users.findByRefCode(refCode);
      if (!referrer) {
        this.logger.debug('BotUpdate', `Referral kodi topilmadi: ${refCode}`);
        return;
      }

      // Duplicate tekshirish
      const existing = await this.leads.findByLeadUserId(me.id);
      if (existing) {
        this.logger.debug('BotUpdate', `Duplicate referral: ${me.id} already has referrer`);
        return;
      }

      // lead yaratish
      const leadResult = await this.leads.createLeadIfNotExists({
        leadUserId: me.id,
        referrerUserId: referrer.id,
        leadName: me.firstName,
        leadUsername: me.username,
        referrerName: referrer.firstName,
        referrerUsername: referrer.username,
      });

      if (leadResult.created) {
        // Direct referral ballini qo'shish
        await this.leads.addDirectReferralBall(referrer.id);
        
        this.logger.info('BotUpdate', `Yangi referral: ${me.firstName} -> ${referrer.firstName}`, {
          leadUserId: me.id,
          referrerId: referrer.id,
        });

        // referrerga xabar yuborish
        try {
          const message = `🎉 <b>Yangi Taklif!</b>\n\n` +
            `👤 <b>${me.firstName || 'Foydalanuvchi'}</b> sizning referral linkingiz orqali botga kirgani!\n\n` +
            `🎁 <b>+1 ball qo'shildi!</b>\n\n` +
            `✨ Agar ular umra chiptasini sotib olsa <b>+5 ball</b> ko'proq olasiz!`;
          
          await ctx.telegram.sendMessage(
            Number(referrer.telegramId),
            message,
            { parse_mode: 'HTML' }
          );
        } catch (error) {
          this.logger.warn('BotUpdate', `Referrerga xabar yuborishda xato: ${referrer.id}`, error);
        }
      }
    } catch (error) {
      this.logger.error('BotUpdate', 'handleReferral da xato', error);
    }
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    const message = `🆘 <b>YORDAM VA KO'RSATMALAR</b>\n\n` +
      `<b>📋 Botdan qanday foydalanish kerak:</b>\n` +
      `1️⃣ Kanalga a'zo bo'ling\n` +
      `2️⃣ Referral link yarating va do'stlaringizga yuboring\n` +
      `3️⃣ Har bir taklif uchun <b>+1 ball</b> olasiz\n` +
      `4️⃣ Toza lead uchun <b>+5 ball</b> qo'shilib qoladi\n` +
      `5️⃣ <b>100 ball</b> to'plaganingizda <b>Bepul Umra Sayohati!</b>\n\n` +
      `<b>🎮 Asosiy tugmalar:</b>\n` +
      `🔗 <b>Referral Link</b> - Shaxsiy link olish\n` +
      `📊 <b>Statistika</b> - Ballalar va statistika\n\n` +
      `<b>❓ Qo'shimcha savol?</b>\n` +
      `Admin bilan bog'lanish: @admin_username`;

    try {
      await ctx.replyWithHTML(message);
    } catch (error) {
      this.logger.error('BotUpdate', 'help command da xato', error);
    }
  }
}
