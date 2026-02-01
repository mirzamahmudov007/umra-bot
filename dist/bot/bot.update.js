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
exports.BotUpdate = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const users_service_1 = require("../users/users.service");
const leads_service_1 = require("../leads/leads.service");
const config_1 = require("@nestjs/config");
let BotUpdate = class BotUpdate {
    constructor(users, leads, config) {
        this.users = users;
        this.leads = leads;
        this.config = config;
        this.GROUP_CHAT_ID = this.config.get('GROUP_CHAT_ID') || '';
        this.BOT_USERNAME = this.config.get('BOT_USERNAME') || 'your_bot';
    }
    async onStart(ctx) {
        const from = ctx.from;
        if (!from)
            return;
        const me = await this.users.createOrUpdateFromTelegram({
            telegramId: BigInt(from.id),
            username: from.username ?? null,
            firstName: from.first_name ?? null,
            lastName: from.last_name ?? null,
            languageCode: from.language_code ?? null,
        });
        const isMember = await this.checkChannelMembership(ctx, from.id);
        if (!isMember) {
            await this.askToJoinChannel(ctx);
            return;
        }
        await this.showMainMenu(ctx, me);
    }
    async checkChannelMembership(ctx, userId) {
        if (!this.GROUP_CHAT_ID)
            return true;
        try {
            const chatMember = await ctx.telegram.getChatMember(this.GROUP_CHAT_ID, userId);
            return ['creator', 'administrator', 'member'].includes(chatMember.status);
        }
        catch (error) {
            console.error('Kanal a\'zoligini tekshirishda xato:', error);
            return false;
        }
    }
    async askToJoinChannel(ctx) {
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
    async showMainMenu(ctx, user) {
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
    async onCheckChannelMembership(ctx) {
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
        const user = await this.users.findByTelegramId(BigInt(userId));
        if (!user) {
            await ctx.reply("❌ Foydalanuvchi topilmadi. Iltimos, /start ni bosing.");
            return;
        }
        await this.showMainMenu(ctx, user);
    }
    async onReferralLinkYaratish(ctx) {
        const from = ctx.from;
        if (!from)
            return;
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
    async onStatistika(ctx) {
        const from = ctx.from;
        if (!from)
            return;
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
    async onCreateReferralLink(ctx) {
        await ctx.answerCbQuery();
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const user = await this.users.findByTelegramId(BigInt(userId));
        if (!user)
            return;
        const personalLink = `https://t.me/${this.BOT_USERNAME}?start=${user.refCode}`;
        const message = `🔗 *Sizning referral linkingiz:*\n\n` +
            `\`${personalLink}\`\n\n` +
            `📋 *Nusxa olish uchun linkni ustiga bosing*`;
        await ctx.replyWithMarkdown(message);
    }
    async onShowStats(ctx) {
        await ctx.answerCbQuery();
        await this.onStatistika(ctx);
    }
    async handleReferral(ctx, me, refCode) {
        const referrer = await this.users.findByRefCode(refCode);
        if (!referrer)
            return;
        const leadResult = await this.leads.createLeadIfNotExists({
            leadUserId: me.id,
            referrerUserId: referrer.id,
            leadName: me.firstName,
            leadUsername: me.username,
            referrerName: referrer.firstName,
            referrerUsername: referrer.username,
        });
        if (leadResult.created) {
            try {
                await ctx.telegram.sendMessage(Number(referrer.telegramId), `🎉 *Yangi taklif!*\n\n👤 ${me.firstName || 'Foydalanuvchi'} sizning referral linkingiz orqali ro'yxatdan o'tdi!\n🎁 +5 ball qo'shildi!`, { parse_mode: 'Markdown' });
            }
            catch (error) {
                console.log('Referrerga xabar yuborishda xato:', error);
            }
        }
    }
    async onHelp(ctx) {
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
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onStart", null);
__decorate([
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "askToJoinChannel", null);
__decorate([
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "showMainMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('check_channel_membership'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onCheckChannelMembership", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🔗 Referral Link Yaratish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onReferralLinkYaratish", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📊 Statistika'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onStatistika", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('create_referral_link'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onCreateReferralLink", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('show_stats'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onShowStats", null);
__decorate([
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object, String]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "handleReferral", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('help'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onHelp", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        leads_service_1.LeadsService,
        config_1.ConfigService])
], BotUpdate);
//# sourceMappingURL=bot.update.js.map