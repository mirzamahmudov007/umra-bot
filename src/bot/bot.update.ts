import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Command, Action, On, Hears } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { UsersService } from '../users/users.service';
import { LeadsService } from '../leads/leads.service';
import { parseStartPayload } from '../utils/refcode';
import { ConfigService } from '@nestjs/config';

@Update()
@Injectable()
export class BotUpdate {
  private readonly GROUP_CHAT_ID: string;
  private readonly BOT_USERNAME: string;

  constructor(
    private users: UsersService,
    private leads: LeadsService,
    private config: ConfigService,
  ) {
    this.GROUP_CHAT_ID = this.config.get<string>('GROUP_CHAT_ID') || '';
    this.BOT_USERNAME = this.config.get<string>('BOT_USERNAME') || 'your_bot';
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

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

    // 3. Agar kanalda bo'lsa, asosiy menyuni ko'rsatish
    await this.showMainMenu(ctx, me);
  }

  // Kanal a'zoligini tekshirish
  private async checkChannelMembership(ctx: Context, userId: number): Promise<boolean> {
    if (!this.GROUP_CHAT_ID) return true;

    try {
      const chatMember = await ctx.telegram.getChatMember(this.GROUP_CHAT_ID, userId);
      return ['creator', 'administrator', 'member'].includes(chatMember.status);
    } catch (error) {
      console.error('Kanal a\'zoligini tekshirishda xato:', error);
      return false;
    }
  }

  // Kanalga a'zo bo'lish so'rovini yuborish
  private async askToJoinChannel(@Ctx() ctx: Context) {
    const message = `Assalomu Alaykum! 👋\n\n` +
      `*Botdan foydalanish uchun kanalga a'zo bo'ling:*`;

    await ctx.replyWithMarkdown(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 Kanalga A'zo Bo'lish",
              url: "https://t.me/ochiqkanal11"
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
  }

  // Asosiy menyuni ko'rsatish (faqat 2 ta button)
  private async showMainMenu(@Ctx() ctx: Context, user: any) {
    const message = `🎉 *Assalomu alaykum, ${user.firstName || 'Foydalanuvchi'}!*\n\n` +
      `✅ *Siz kanalga a'zo bo'lgansiz!*\n\n` +
      `*Quyidagi tugmalardan birini tanlang:*`;

    await ctx.replyWithMarkdown(message, {
      reply_markup: {
        keyboard: [
          ["🔗 Referral Link Yaratish"],
          ["📊 Statistika"]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  }

  // ========== CALLBACK HANDLERS ==========

  @Action('check_channel_membership')
  async onCheckChannelMembership(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply("❌ Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      return;
    }

    const isMember = await this.checkChannelMembership(ctx, userId);

    if (!isMember) {
      await ctx.reply("❌ *Hali kanalga a'zo bo'lmagansiz!*\n\nIltimos, avval kanalga a'zo bo'ling va keyin \"✅ A'zo Bo'ldim\" tugmasini bosing.", {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 Kanalga A'zo Bo'lish",
                url: "https://t.me/ochiqkanal11"
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
      await ctx.reply("❌ Foydalanuvchi topilmadi. Iltimos, /start ni bosing.");
      return;
    }

    await this.showMainMenu(ctx, user);
  }

  // ========== TEXT HANDLERS ==========

  @Hears('🔗 Referral Link Yaratish')
  async onReferralLinkYaratish(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    // Kanal a'zoligini tekshirish
    const isMember = await this.checkChannelMembership(ctx, from.id);
    if (!isMember) {
      await this.askToJoinChannel(ctx);
      return;
    }

    const user = await this.users.findByTelegramId(BigInt(from.id));
    if (!user) {
      await ctx.reply("❌ Siz avval ro'yxatdan o'tmagansiz. /start ni bosing.");
      return;
    }

    const personalLink = `https://t.me/${this.BOT_USERNAME}?start=${user.refCode}`;

    const message = `*Assalomu Alaykum!*\n\n` +
      `🎁 *Bepul umra sayohati uchun:*\n` +
      `1. Quyidagi linkni do'stlaringizga yuboring\n` +
      `2. Har bir do'stingiz umra chiptasi sotib olsa +5 ball\n` +
      `3. Toza leadlar sonini oshiring!\n\n` +
      `🔗 *Sizning referral linkingiz:*\n` +
      `\`${personalLink}\`\n\n` +
      `📋 *Nusxa olish uchun linkni ustiga bosing*`;

    await ctx.replyWithMarkdown(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 Kanalni Ko'rish",
              url: "https://t.me/ochiqkanal11"
            }
          ],
          [
            {
              text: "📊 Statistika",
              callback_data: "show_stats"
            }
          ]
        ]
      }
    });
  }

  @Hears('📊 Statistika')
  async onStatistika(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    // Kanal a'zoligini tekshirish
    const isMember = await this.checkChannelMembership(ctx, from.id);
    if (!isMember) {
      await this.askToJoinChannel(ctx);
      return;
    }

    const user = await this.users.findByTelegramId(BigInt(from.id));
    if (!user) {
      await ctx.reply("❌ Siz avval ro'yxatdan o'tmagansiz. /start ni bosing.");
      return;
    }

    const referrals = await this.users.findByReferrerId(user.id);

    let message = `📊 *SIZNING STATISTIKANGIZ*\n\n`;
    message += `👤 *Ism:* ${user.firstName || 'Noma\'lum'}\n`;
    message += `🔗 *Referral kodingiz:* \`${user.refCode}\`\n\n`;

    message += `📈 *STATISTIKA:*\n`;
    message += `• Jami takliflar: ${user.leadsCount}\n`;
    message += `• Toza leadlar: ${user.qualifiedCount}\n`;
    message += `• Sizning referrallaringiz: ${referrals.length}\n\n`;

    message += `� *Bonuslar:*\n`;
    message += `• Har bir taklif: +1 ball\n`;
    message += `• Toza lead (umra chiptasi): +5 ball`;

    await ctx.replyWithMarkdown(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔗 Referral Link Yaratish",
              callback_data: "create_referral_link"
            }
          ]
        ]
      }
    });
  }

  // ========== CALLBACK HANDLERS ==========

  @Action('create_referral_link')
  async onCreateReferralLink(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const userId = ctx.from?.id;

    if (!userId) return;

    const user = await this.users.findByTelegramId(BigInt(userId));
    if (!user) return;

    const personalLink = `https://t.me/${this.BOT_USERNAME}?start=${user.refCode}`;

    const message = `🔗 *Sizning referral linkingiz:*\n\n` +
      `\`${personalLink}\`\n\n` +
      `📋 *Nusxa olish uchun linkni ustiga bosing*`;

    await ctx.replyWithMarkdown(message);
  }

  @Action('show_stats')
  async onShowStats(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await this.onStatistika(ctx);
  }

  // ========== REFERRAL HANDLING ==========

  // Bu funksiya start payload bilan kelganda ishlaydi
  private async handleReferral(@Ctx() ctx: Context, me: any, refCode: string) {
    const referrer = await this.users.findByRefCode(refCode);
    if (!referrer) return;

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
      // referrerga xabar yuborish
      try {
        await ctx.telegram.sendMessage(
          Number(referrer.telegramId),
          `🎉 *Yangi taklif!*\n\n👤 ${me.firstName || 'Foydalanuvchi'} sizning referral linkingiz orqali ro'yxatdan o'tdi!\n🎁 +5 ball qo'shildi!`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        console.log('Referrerga xabar yuborishda xato:', error);
      }
    }
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    const message = `🆘 *YORDAM*\n\n` +
      `*Botdan foydalanish uchun:*\n` +
      `1. Kanalga a'zo bo'ling\n` +
      `2. Referral link yarating\n` +
      `3. Do'stlaringizni taklif qiling\n` +
      `4. Ballar to'plang\n` +
      `5. 100 ball to'plaganingizda umra sayohatini qo'lga kiriting!\n\n` +
      `*Tugmalar:*\n` +
      `🔗 Referral Link Yaratish - Shaxsiy link olish\n` +
      `📊 Statistika - Ballaringizni ko'rish\n\n` +
      `*Admin:* @admin_username`;

    await ctx.replyWithMarkdown(message);
  }
}