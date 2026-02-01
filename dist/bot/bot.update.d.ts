import type { Context } from 'telegraf';
import { UsersService } from '../users/users.service';
import { LeadsService } from '../leads/leads.service';
import { ConfigService } from '@nestjs/config';
export declare class BotUpdate {
    private users;
    private leads;
    private config;
    private readonly GROUP_CHAT_ID;
    private readonly BOT_USERNAME;
    constructor(users: UsersService, leads: LeadsService, config: ConfigService);
    onStart(ctx: Context): Promise<void>;
    private checkChannelMembership;
    private askToJoinChannel;
    private showMainMenu;
    onCheckChannelMembership(ctx: Context): Promise<void>;
    onReferralLinkYaratish(ctx: Context): Promise<void>;
    onStatistika(ctx: Context): Promise<void>;
    onCreateReferralLink(ctx: Context): Promise<void>;
    onShowStats(ctx: Context): Promise<void>;
    private handleReferral;
    onHelp(ctx: Context): Promise<void>;
}
